(function ($) {
  const localStorageKey = 'chrr_wwfh_saved_list';
  let stashedEmailFormNode = null;
  let stashedDownloadFormNode = null;

  /**
   * @returns {string} one of `` | `modal` | `modal--email` | `modal--download`
   */
  window.chrr_wwfh_getRouterState = function () {
    return window.location.hash.replace(/#/g, '');
  };

  /**
   * @param {string} newPath one of `` | `modal` | `modal--email` | `modal--download`
   */
  window.chrr_wwfh_setRouterState = function (newPath) {
    const url = window.location.pathname + (newPath ? '#' + newPath : '');

    history.pushState(
      {
        path: newPath,
      },
      '',
      url
    );
  };

  /**
   * Puts the forms in the objects `stashedEmailFormNode`
   * and `stashedEmailFormNode`; If exists remove them
   * from DOM.
   */
  window.chrr_wwfh_stashForms = function () {
    if (!stashedEmailFormNode) {
      stashedEmailFormNode = chrr_wwfh_getEmailForm();
    }

    if (!stashedDownloadFormNode) {
      stashedDownloadFormNode = chrr_wwfh_getDownloadsForm();
    }

    // give some time for the reset to finish
    if (stashedEmailFormNode) {
      stashedEmailFormNode.setAttribute('hidden', 'hidden');
      document.body.appendChild(stashedEmailFormNode);
    }

    if (stashedDownloadFormNode) {
      stashedDownloadFormNode.setAttribute('hidden', 'hidden');
      document.body.appendChild(stashedDownloadFormNode);
    }

    chrr_wwfh_resetEmailForm();
    chrr_wwfh_resetDownloadForm();
  };

  window.chrr_wwfh_resetEmailForm = function () {
    $(stashedEmailFormNode)
      .find('.js-webform-confirmation-back-submit-ajax')
      .click();
  };

  window.chrr_wwfh_resetDownloadForm = function () {
    $(stashedDownloadFormNode)
      .find('.js-webform-confirmation-back-submit-ajax')
      .click();
  };

  /**
   * @param {Array<string>} key
   * @param {object} data
   */
  window.chrr_wwfh_sendEvent = function (keys, data) {
    keys
      .filter(function (o) {
        return o;
      })
      .forEach(function (key) {
        const event = new CustomEvent(key, { detail: data });
        document.body.dispatchEvent(event);
      });
  };

  /**
   * Wrapper for chrr_wwfh_download for use in webform
   */
  window.chrr_wwfh_downloadWrapper = function () {
    function getDate() {
      const d = new Date();
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }

      if (day.length < 2) {
        day = '0' + day;
      }

      return [year, month, day].join('');
    }

    const body = chrr_wwfh_getCheckedItems();
    const blob = new Blob([body.download], {
      type: 'text/plain;charset=utf-8',
    });
    const filename = 'wwfhstrategies' + getDate() + '.txt';

    setTimeout(function () {
      window.saveAs(blob, filename);
    }, 1500);
  };

  /**
   * Sets the value of key to value
   * @param {string} id
   * @param {string} value
   */
  window.chrr_wwfh_setItem = function (id, value, dataset) {
    const key = chrr_wwfh_createKey(id);
    const data = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '{}'
    );

    const title = dataset.wwfhProgramTitle;
    const url = dataset.wwfhProgramUrl;
    const summary = dataset.wwfhProgramSummary;

    if (value) {
      data[key] = {
        checked: true,
        title: title,
        summary: summary,
        url: url,
      };
    } else {
      delete data[key];
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  /**
   * Sets whether the program id is checked or unchecked
   * @param {string} id
   * @param {bool} checked
   */
  window.chrr_wwfh_setCheckItem = function (id, checked) {
    const key = chrr_wwfh_createKey(id);
    const data = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '{}'
    );

    data[key].checked = checked;
    window.localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  /**
   * Sets all items to checked
   */
  window.chrr_wwfh_setAllChecked = function () {
    const data = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '{}'
    );

    for (let x in data) {
      if (data.hasOwnProperty(x)) {
        const obj = data[x];

        obj.checked = true;
      }
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  /**
   * Sets all items to unchecked
   */
  window.chrr_wwfh_setAllUnchecked = function () {
    const data = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '{}'
    );

    for (let x in data) {
      if (data.hasOwnProperty(x)) {
        const obj = data[x];

        obj.checked = false;
      }
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  /**
   * Returns an object containing all WWFH strategies
   * @returns {object}
   */
  window.chrr_wwfh_getItems = function () {
    const data = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '{}'
    );
    return data;
  };

  /**
   * Returns all checked items in blurb format
   * @returns {string}
   */
  window.chrr_wwfh_getCheckedItems = function () {
    const data = chrr_wwfh_getItems();
    let stringArray = [];
    const raw = [];

    for (let x in data) {
      if (data.hasOwnProperty(x)) {
        const obj = data[x];

        if (!obj.checked) {
          continue;
        }

        obj.key = x;

        let localString = [obj.title, obj.url, obj.summary].join('\n');

        raw.push(obj);
        stringArray.push(localString);
      }
    }

    const preamble = [
      'Thank you for using What Works for Health, a product of the County Health Rankings & Roadmaps program.\n',
      'For more information about these and other strategies, visit www.countyhealthrankings.org/whatworks.\n\n',
    ].join('\n');

    return {
      download: preamble + stringArray.join('\n\n'),
      raw: raw,
    };
  };

  /**
   * Returns the number of marked WWFH strategies
   * @returns {number}
   */
  window.chrr_wwfh_getCount = function () {
    return Object.keys(chrr_wwfh_getItems()).length;
  };

  /**
   * Returns the number of checked WWFH strategies
   * @returns {number}
   */
  window.chrr_wwfh_getCheckedCount = function () {
    const data = JSON.parse(
      window.localStorage.getItem(localStorageKey) || '{}'
    );

    let count = 0;
    for (let x in data) {
      if (data.hasOwnProperty(x)) {
        const obj = data[x];

        if (obj.checked) {
          count++;
        }
      }
    }
    return count;
  };

  /**
   * @private
   * @returns {HTMLFormElement | null}
   */
  const unhideNode = function (node) {
    const form = node.querySelector('form');
    node.removeAttribute('hidden');
    form.removeAttribute('hidden');

    return node;
  };

  /**
   * Get Email Form
   * @returns {HTMLFormElement}
   */
  window.chrr_wwfh_getEmailForm = function () {
    const formSelector = '*[data-chrr-form=email]';

    let node;
    if (stashedEmailFormNode) {
      node = stashedEmailFormNode;
    } else {
      const nodes = $(formSelector);
      node = nodes[0].parentElement;
    }

    const clone = unhideNode(node);
    const form = clone.querySelector('form');
    const items = chrr_wwfh_getCheckedItems();
    let idField;
    if (form) {
      idField = form.querySelector('*[name=program_ids]');
      const blobField = form.querySelector('*[name=selected_program_data]');
      if (idField) {
        blobField.value = window.btoa(
          unescape(
            encodeURIComponent(
              JSON.stringify(
                items.raw.map(function (o) {
                  delete o.checked;
                  return o;
                })
              )
            )
          )
        );
      }

      if (idField) {
        idField.value = items.raw
          .map(function (o) {
            return String(o.key);
          })
          .join(',');
      }

      const submitButton = form.querySelector('.js-form-submit');
      if (submitButton) {
        const options = { once: true };
        const submitButtonGTMEvent = function () {
          chrr_wwfh_sendEvent(['wwfh_gtm'], {
            action: 'EmailStrategies',
            label: 'Submit',
          });
        };
        submitButton.addEventListener('click', submitButtonGTMEvent, options);
      }
    }

    return clone;
  };

  /**
   * Get Downloads Form
   * @returns {HTMLFormElement}
   */
  window.chrr_wwfh_getDownloadsForm = function () {
    const formSelector = '*[data-chrr-form=download]';

    let node;
    if (stashedDownloadFormNode) {
      node = stashedDownloadFormNode;
    } else {
      const nodes = $(formSelector);
      node = nodes[0].parentElement;
    }

    const clone = unhideNode(node);
    const items = chrr_wwfh_getCheckedItems();
    const form = clone.querySelector('form');

    if (form) {
      const idField = form.querySelector('*[name=program_ids]');

      if (idField) {
        idField.value = items.raw
          .map(function (o) {
            return String(o.key);
          })
          .join(',');
      }

      const submitButton = form.querySelector('.js-form-submit');
      if (submitButton) {
        const options = { once: true };
        const submitButtonGTMEvent = function () {
          chrr_wwfh_sendEvent(['wwfh_gtm'], {
            action: 'DownloadStrategies',
            label: 'Submit',
          });
        };
        submitButton.addEventListener('click', submitButtonGTMEvent, options);
      }
    }

    return clone;
  };

  /**
   * Gets and item by the specified id
   * @param {string} id
   */
  window.chrr_wwfh_getItem = function (id) {
    const key = chrr_wwfh_createKey(id);
    const data = chrr_wwfh_getItems();
    return data[key] || false;
  };

  /**
   * Gets a key based on id
   * @param {string} id  UUID of wwfh
   * @returns {string} key
   */
  window.chrr_wwfh_createKey = function (id) {
    return String(id);
  };

  /**
   * Gets state (saved/not saved) of current wwfh strategy
   * @param {string} id
   * @returns {bool}
   */
  window.chrr_wwfh_getState = function (id) {
    const value = chrr_wwfh_getItem(chrr_wwfh_createKey(id)) || false;
    return value;
  };

  window.chrr_wwfh_stashForms();
})(jQuery);
