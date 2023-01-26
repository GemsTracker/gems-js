<template>
  <div class="comm-fields">
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>Variable</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, name, index) in commFields" :key="index">
          <td class="col" v-html="`{{${name}}}`" />
          <td class="col">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>

export default {
  props: {
    commFields: {
      type: Object,
      required: true,
    },
  },
};
</script>
