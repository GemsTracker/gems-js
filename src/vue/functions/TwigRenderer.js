import { ref, readonly } from 'vue';

/**
 * @description Composable for asynchronously loading and using the Twig.js template engine.
 *
 * This composable dynamically imports the 'twig' library when the render function
 * is first called, ensuring it's only loaded when needed.
 *
 * @returns {object} An object containing:
 * - renderTemplate: An async function to render a Twig template string.
 * - isLoading: A readonly ref indicating if the Twig library is currently loading.
 * - error: A readonly ref containing any error that occurred during loading or rendering.
 */
export function useTwigRenderer() {
  const twigInstance = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const loadTwig = async () => {
    // If already loaded, return the instance
    if (twigInstance.value) {
      return twigInstance.value;
    }
    // If already loading, wait for the existing promise (basic check)
    if (isLoading.value) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      return twigInstance.value; // Check again
    }


    isLoading.value = true;
    error.value = null;

    try {
      // Dynamically import the 'twig' library
      const twig = await import('twig');
      // Store the default export (which contains the twig function)
      twigInstance.value = twig.default || twig; // Handle different module export styles
      console.log('Twig.js library loaded successfully.');
      return twigInstance.value;
    } catch (err) {
      console.error('Failed to load Twig.js library:', err);
      error.value = err instanceof Error ? err : new Error('Failed to load Twig.js');
      // Re-throw or handle as needed
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * @description Renders a Twig template string with the given context.
   * Loads the Twig library if it hasn't been loaded yet.
   *
   * @param {string} templateString - The Twig template content.
   * @param {object} [context={}] - The data/context object for the template.
   * @returns {Promise<string>} A promise that resolves with the rendered HTML string.
   * @throws {Error} Throws an error if the library fails to load or rendering fails.
   */
  const renderTemplate = async (templateString, context = {}) => {
    try {
      // Ensure the Twig library is loaded
      const twig = await loadTwig();

      // Check if loading was successful and the instance is available
      if (!twig || !twig.twig) {
        throw new Error('Twig library is not available or invalid.');
      }

      // Compile the template using twig.twig()
      const template = twig.twig({
        data: templateString
      });

      // Render the template with the provided context
      return template.render(context);

    } catch (err) {
      console.error('Error rendering Twig template:', err);
      error.value = err instanceof Error ? err : new Error('Failed to render Twig template');
      // Re-throw the error so the caller can handle it
      throw error.value;
    }
  };

  return {
    renderTemplate,
    // Expose loading and error states as readonly refs
    isLoading: readonly(isLoading),
    error: readonly(error),
  };
}