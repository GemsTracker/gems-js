import { url } from '../general/functions';

export default class AuthIdleChecker {
  constructor() {
    this.requestTime = new Date();
    const body = document.getElementsByTagName('body')[0];

    this.maxIdleTime = parseInt(body?.getAttribute('data-max-idle-time'), 10) || 1200;
    this.authPollInterval = parseInt(body?.getAttribute('data-auth-poll-interval'), 10) || 60;

    this.init();

    this.schedule();
  }

  init() {
    const buttonAlive = document.getElementById('authIdleCheckerWarningAlive');
    if (! buttonAlive) {
      return;
    }
    buttonAlive?.addEventListener('click', () => {
      fetch(url('/auth/idle-alive'), { method: 'post' })
        .then((response) => {
          if (!response.ok) {
            throw new Error();
          }

          return response.json();
        })
        .then((data) => {
          this.requestTime = new Date();

          this.toggleIdleLogoutWarning(false);

          if (data.redirect) {
            window.location.href = data.redirect;
          }
        });
    });

    const buttonIgnore = document.getElementById(
      'authIdleCheckerWarningIgnore',
    );
    buttonIgnore?.addEventListener('click', () => {
      this.toggleIdleLogoutWarning(false);
    });
  }

  schedule() {
    setTimeout(() => {
      this.check();
      this.schedule();
    }, this.authPollInterval * 1000);
  }

  check() {
    fetch(url('/auth/idle-poll'))
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((data) => {
        if (data.show_idle_logout_warning) {
          this.toggleIdleLogoutWarning(true);
        }

        if (data.redirect) {
          window.location.href = data.redirect;
        }
      })
      .catch(() => {
        // Fallback in case of e.g. network failure
        if (+new Date() - +this.requestTime > this.maxIdleTime * 1000) {
          window.location.href = url('/');
        }
      });
  }

  toggleIdleLogoutWarning(show) {
    const warning = document.getElementById('authIdleCheckerWarning');
    if (warning) {
      if (show) {
        warning.removeAttribute('hidden');
        warning.classList.remove('hidden');
      } else {
        warning.setAttribute('hidden', '');
        warning.classList.add('hidden');
      }
    }
  }
}

window.addEventListener('load', () => {
  new AuthIdleChecker();
});
