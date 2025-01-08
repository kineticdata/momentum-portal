import { useState } from 'react';
import { Modal } from '../../../atoms/Modal.jsx';
import { SignaturePad } from '@ark-ui/react/signature-pad';
import clsx from 'clsx';
import { Button } from '../../../atoms/Button.jsx';
import { Icon } from '../../../atoms/Icon.jsx';

const Signature = () => {
  const [open, setOpen] = useState(false);
  const [signature, setSignature] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [savedSignature, setSavedSignature] = useState(null);

  const handleClear = () => {
    setSignature(null); // Clear the signature
  };

  const onSave = () => {
    setSavedSignature(imageUrl)
    setOpen(false);
  };

  const onExitComplete = () => {
    setSignature(null);
    setImageUrl('');
  };

  return (
    <>
      <div className="flex flex-col">
        <span>Signature</span>
        <Button
          variant="secondary"
          onClick={() => setOpen(true)}
          className={clsx(
            'w-[271px] h-[59px] bg-white border border-primary-400 rounded-[20px]',
            'hover:border-primary-400 border bg-primary-100 !important',
          )}
        >
          {savedSignature ? (
            <img src={savedSignature} alt="signature" />
          ) : (
            <span>
              Signature <Icon name="writing" aria-label="signature" />
            </span>
          )}
        </Button>
      </div>
      <Modal
        title="Sign your form"
        open={open}
        onOpenChange={({ open }) => setOpen(open)}
        onExitComplete={onExitComplete}
        size="sm"
      >
        <div slot="body">
          <SignaturePad.Root
            onDrawEnd={details =>
              details.getDataUrl('image/png').then(url => setImageUrl(url))
            }
          >
            <div className="mb-2 font-semibold text-gray-900">
              <SignaturePad.Label>Signature</SignaturePad.Label>
            </div>
            <SignaturePad.Control
              className={clsx(
                'border-primary-400 border bg-gray-100 relative rounded-[20px]',
                'hover:border-primary-400 border hover:bg-primary-100',
                'focus-within:border-secondary-400 focus-within:bg-gray-100',
              )}
            >
              <SignaturePad.Segment value={signature} onChange={setSignature} />
              <SignaturePad.Guide
                className={clsx(
                  'h-[200px] relative rounded-[20px] border border-solid',
                  'border-[var(--primary-400, #B8B7F0)]',
                )}
              >
                <SignaturePad.ClearTrigger
                  className="absolute top-2 right-2 mr-3 mt-3"
                  onClick={handleClear}
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
            I understand this is a legal representation of my signature.
          </p>
          <Button onClick={() => onSave()} className="w-full rounded-[20px]">Save</Button>
        </div>
      </Modal>
    </>
  );
};

export default Signature;
