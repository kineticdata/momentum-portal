import t from 'prop-types';
import { getChildSlots } from '../helpers/atoms.js';
import { Modal } from './Modal.jsx';
import { KineticForm } from '../components/kinetic-form/KineticForm.jsx';

/**
 * FormModal wraps a modal with a description slot and a Kinetic form.
 *
 * @param {Object} props
 * @param {boolean} [props.open] Whether the modal is open.
 * @param {Function} [props.onOpenChange] Callback for when open state changes.
 * @param {string} [props.title] Optional title text for the modal.
 * @param {string} [props.size='sm'] Size of the modal.
 * @param {JSX.Element|JSX.Element[]} [props.children] Slot content for modal sections.
 */
export const FormModal = ({
  open,
  onOpenChange,
    onSubmit,
  title = '',
  size = 'sm',
  closeOnEscape,
  closeOnInteractOutside,
  children,
}) => {
  const slots = getChildSlots(children, {
    componentName: 'Modal',
    requiredSlots: [],
    optionalSlots: ['trigger', 'description', 'body', 'footer'],
  });

  return (
    <Modal
      title={title}
      size={size}
      open={open}
      onOpenChange={onOpenChange}
      closeOnEscape={closeOnEscape}
      closeOnInteractOutside={closeOnInteractOutside}
    >
      <div slot="description">{slots.description}</div>
      <div slot="body">
        <KineticForm kappSlug="catalog" formSlug="tenant-decommission" completed={onSubmit}/>
      </div>
    </Modal>
  );
};

FormModal.propTypes = {
  open: t.bool,
  onOpenChange: t.func,
  onExitComplete: t.func,
  title: t.string,
  closeOnEscape: t.bool,
  closeOnInteractOutside: t.bool,
  size: t.string,
  toasterId: t.string,
  children: t.node,
};
