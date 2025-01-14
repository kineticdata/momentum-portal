import { useState, forwardRef } from 'react';
import clsx from 'clsx';
import t from 'prop-types';
import { Modal } from '../../../atoms/Modal.jsx';
import { SignaturePad } from '@ark-ui/react/signature-pad';
import { Icon } from '../../../atoms/Icon.jsx';
import {
  WidgetAPI,
  registerWidget,
  validateContainer,
  validateField,
} from './index.js';
import { getCsrfToken } from '@kineticdata/react';
import { toastError } from '../../../helpers/toasts.js';

/**
 * @param {string} className
 * @param {Object} props.field Kinetic field object
 */
const SignatureComponent = forwardRef(
  (
    {
      className,
      field,
      modalTitle,
      signaturePadLabel,
      agreementText,
      buttonLabel,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [savedSignature, setSavedSignature] = useState(null);

    // Function to get the value
    const getValue = () => {
      return field.value();
    };

    // Function to update the value
    const setValue = value => {
      setSavedSignature(value);
    };

    const resetSignature = () => {
      setImageUrl('');
    };

    const verifyFilename = filename => {
      let fn = filename || `${field.form().slug()}_signature`;
      if (!/\.pdf$/i.test(fn)) {
        fn += '.png';
      }
      return fn;
    };

    const dataUrlToBlob = dataUrl => {
      return fetch(dataUrl)
        .then(response => response.blob())
        .catch(error =>
          console.error('Error converting data URL to Blob:', error),
        );
    };

    const onSave = async () => {
      let data = new FormData();
      data.append(
        'files',
        await dataUrlToBlob(imageUrl),
        verifyFilename('widgets_signature'),
      );

      fetch(field.form().fileUploadPath(), {
        method: 'POST',
        headers: { 'X-XSRF-TOKEN': getCsrfToken() },
        body: data,
      })
        .then(async response => {
          if (!response.ok) {
            throw new Error('Failed to save signature.');
          }

          const responseData = await response.json();
          field.value(responseData);
          setSavedSignature(imageUrl);
          setOpen(false);
        })
        .catch(() => {
          toastError({
            title: 'Failed to save signature.',
          });
        });
    };

    const onExitComplete = () => {
      setImageUrl('');
    };

    return (
      <WidgetAPI
        ref={ref}
        api={{
          getValue,
          setValue,
        }}
      >
        <div className={clsx(className, 'flex flex-col')}>
          <label className="block text-sm font-semibold text-gray-900 leading-4 pb-2">
            Signature
          </label>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-[271px] h-[59px] bg-white border border-primary-400 rounded-[20px] hover:bg-primary-100 flex items-center justify-center"
          >
            {savedSignature ? (
              <img
                src={savedSignature}
                alt="signature"
                className="max-h-full max-w-full object-contain rounded-[20px]"
              />
            ) : (
              <span className="flex items-center gap-2">
                Signature <Icon name="writing" aria-label="signature" />
              </span>
            )}
          </button>
        </div>
        <Modal
          title={modalTitle ?? 'Sign your form'}
          open={open}
          onOpenChange={({ open }) => setOpen(open)}
          onExitComplete={onExitComplete}
          size="sm"
          className="!rounded-[40px]"
        >
          <div slot="body">
            <SignaturePad.Root
              onDrawEnd={details =>
                details.getDataUrl('image/png').then(url => setImageUrl(url))
              }
            >
              <div className="mb-2 font-semibold text-gray-900">
                <SignaturePad.Label>
                  {signaturePadLabel ?? 'Signature'}
                </SignaturePad.Label>
              </div>
              <SignaturePad.Control
                className={clsx(
                  'border border-primary-400 bg-gray-100 relative rounded-[20px] transition-all',
                  'hover:bg-primary-100',
                  {
                    'focus-within:border-secondary-400': !imageUrl,
                    'border-secondary-400': imageUrl,
                  },
                )}
              >
                <SignaturePad.Segment />
                <SignaturePad.Guide
                  className={clsx(
                    'h-[200px] relative rounded-[20px] border border-solid',
                    'border-[var(--primary-400, #B8B7F0)]',
                  )}
                >
                  <SignaturePad.ClearTrigger
                    className="absolute top-2 right-2 mr-3 mt-3"
                    onClick={resetSignature}
                  >
                    <Icon name="refresh" aria-label="reset"></Icon>
                  </SignaturePad.ClearTrigger>
                  <div className="flex justify-between items-center absolute bottom-4 left-5 right-6 border-t-2 border-gray-400"></div>
                </SignaturePad.Guide>
              </SignaturePad.Control>
            </SignaturePad.Root>
          </div>
          <div slot="footer" className="flex flex-col items-center">
            <p className="text-center text-small text-gray-900">
              {agreementText ??
                'I understand this is a legal representation of my signature.'}
            </p>
            <button
              type="button"
              onClick={onSave}
              className="w-full rounded-[20px] bg-secondary-400 button-text py-2 font-semibold border border-primary-500"
            >
              {buttonLabel ?? 'Save'}
            </button>
          </div>
        </Modal>
      </WidgetAPI>
    );
  },
);

SignatureComponent.propTypes = {
  className: t.string,
  field: t.object.isRequired,
};

/**
 * Function that initializes the Signature widget. This function validates the
 * provided parameters, and then registers the widget, which will create an
 * instance of the widget and render it into the provided container.
 *
 * @param {HTMLElement} container HTML Element into which to render the widget.
 * @param {Object} field Kinetic text field with 2 or more rows.
 * @param {SignatureWidgetConfig} config Configuration object for the widget.
 * @param {string} [id] Optional id that can be used to retrieve a reference to
 *  the widget's API functions using the `Signature.get` function.
 */
export const Signature = ({ container, field, config, id } = {}) => {
  if (
    validateContainer(container, 'Signature Widget') &&
    validateField(field, 'attachment', 'Signature')
  ) {
    return registerWidget(Signature, {
      container,
      Component: SignatureComponent,
      props: { ...config, field },
      id,
    });
  }
};

/**
 * @typedef {Object} SignatureWidgetConfig
 * @property {string} [modalTitle] The title displayed at the top of the modal.
 * @property {string} [signaturePadLabel] The label displayed above the signature pad.
 * @property {string} [agreementText] The text displayed to indicate the agreement for the signature.
 * @property {string} [buttonLabel] The label for the "Save" button in the modal.
 */
