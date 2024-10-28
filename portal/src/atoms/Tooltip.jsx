import t from 'prop-types';
import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip';
import { calcPlacement, getChildSlots } from '../helpers/index.js';

/**
 * A label that provides information on hover or focus.
 *
 * @param {Object} props Props object
 * @param {string} [props.content] The content to display inside the tooltip.
 * @param {boolean} [props.interactive] Is the tooltip open.
 * @param {('bottom'|'top'|'left'|'right')} [props.position=bottom] The position
 * of the menu relative to the trigger.
 * @param {('start'|'middle'|'end')} [props.alignment=start] The alignment of
 * the menu relative to the trigger.
 * @param {boolean} [props.open] Is the tooltip open.
 * @param {JSX.Element|JSX.Element[]} [props.children] Elements to inject into
 *  available slots in the menu. Available slots are:
 * - trigger: Component that toggles the tooltip open state when interacted with.
 * - content: Optional slot to override the default content rendered via the `items` prop.
 */

export const Tooltip = ({
  content,
  interactive,
  position,
  alignment,
  open,
  onOpenChange,
  children,
}) => {
  const slots = getChildSlots(children, {
    componentName: 'Tooltip',
    requiredSlots: ['trigger'],
    optionalSlots: ['content'],
  })

  const placement = calcPlacement(position, alignment);

  return (
    <ArkTooltip.Root
      openDelay={1}
      interactive={interactive}
      open={open}
      onOpenChange={onOpenChange}
      positioning={{ placement }}
    >
      {slots.trigger && (
        <ArkTooltip.Trigger asChild>
          {slots.trigger}
        </ArkTooltip.Trigger>
      )}
      <ArkTooltip.Positioner>
      <ArkTooltip.Content>
        {slots.content || content}
      </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </ArkTooltip.Root>
  );
};

Tooltip.propTypes = {
  content: t.string,
  interactive: t.bool,
  position: t.oneOf(['bottom', 'top', 'left', 'right']),
  alignment: t.oneOf(['start', 'middle', 'end']),
  open: t.bool,
  onOpenChange: t.func,
  children: t.node,
};