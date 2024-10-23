import { isValidElement } from 'react';

/**
 * Conditionally calls a function if the `fn` parameter is of type function.
 *
 * @param {Function|*} fn - Parameter to call if it is a function.
 * @param {*} [returnIfNotFn] - Parameter to return if `fn` is not a function.
 * @param {*[]} [args=[]] - List of arguments to pass to the `fn` parameter if
 *  it's a function.
 * @returns {*} Result of `fn` being called with `args` if it is a function, or
 *  `returnIfNotFn` otherwise.
 */
export const callIfFn = (fn, returnIfNotFn, args = []) => {
  if (typeof fn === 'function') return fn(...args);
  return returnIfNotFn;
};

/**
 * Parses `values` out of URL search parameters and returns them as a map.
 */
export const valuesFromQueryParams = queryParams => {
  return Object.entries(Object.fromEntries([...queryParams])).reduce(
    (values, [key, value]) => {
      if (key.startsWith('values[')) {
        const vk = key.match(/values\[(.*?)\]/)[1];
        return { ...values, [vk]: value };
      }
      return values;
    },
    {},
  );
};

/**
 * Wraps a parameter in an array if it isn't already an array.
 *
 * @param {*|Array} maybeArray The parameter to wrap in an array if it isn't
 *  already an array.
 * @returns {Array}
 */
export const asArray = maybeArray =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray];

/**
 * Parses the children of a React element returns a map of children that are
 * elements with a `slot` prop, mapped by the slot value.
 *
 * @param {Object|Array} children The children of a React element.
 * @param {Object} validationProps Options for validating the data.
 * @param {string} [validationProps.componentName] The name of the component
 *  using this function, to use in error and warning messages.
 * @param {string[]} [validationProps.requiredSlots] The names of the slots that
 *  are required to be populated.
 * @param {string[]} [validationProps.optionalSlots] The names of slots that are
 *  optional. If provided, the function will warn if extra slots are provided.
 * @returns {Object.<string, Object>} A map of children that are React elements
 *  and have a valid slot prop.
 */
export const getChildSlots = (children, validationProps = {}) => {
  const { componentName, requiredSlots = [], optionalSlots } = validationProps;
  // If the optionalSlots parameter is an array, validate that unknown slot
  // names are not used
  const checkOptional = Array.isArray(optionalSlots);

  const childrenArray = asArray(children);
  // Filter to only valid React elements
  const elementChildren = childrenArray.filter(isValidElement);

  // Map the children by their slots, and validate the slots
  const [slots, validations] = elementChildren.reduce(
    ([slots, validations], child) => {
      const slotName = child.props.slot;
      // If no slot name, ignore this element
      if (!slotName) {
        // Increment the invalid count validation
        return [slots, { ...validations, invalid: validations.invalid + 1 }];
      }

      // Check validations for required slots, and superfluous slots
      const isRequired = requiredSlots.includes(slotName);
      const missing = isRequired
        ? validations.missing.filter(slot => slot !== slotName)
        : validations.missing;
      const isExtra =
        checkOptional && !isRequired && !optionalSlots.includes(slotName);
      const extra = isExtra
        ? [...validations.extra, slotName]
        : validations.extra;

      return [
        { ...slots, [child.props.slot]: child },
        { ...validations, missing, extra },
      ];
    },
    [
      {},
      {
        missing: requiredSlots,
        extra: [],
        invalid: childrenArray.length - elementChildren.length,
      },
    ],
  );

  // Print errors and warnings
  if (validations.missing.length > 0) {
    console.error(
      `${componentName || 'Component'} Error: The following child slots are missing but required: ${validations.missing.join(', ')}.`,
    );
  }
  if (validations.extra.length > 0) {
    console.warn(
      `${componentName || 'Component'} Warning: The following child slots were defined, but are not valid: ${validations.extra.join(', ')}.`,
    );
  }
  if (validations.invalid > 0) {
    console.warn(
      `${componentName || 'Component'} Warning: There were ${validations.invalid} children components defined that were not elements or did not have slots. These will be ignored.`,
    );
  }

  // Return the mapped slots
  return slots;
};

/**
 * Combines the position and alignment props into the correct placement value
 * used by Ark UI.
 * @param {('bottom'|'top'|'left'|'right')} [position]
 * @param {('start'|'middle'|'end')} [alignment]
 * @returns {string}
 */
export const calcPlacement = (position, alignment) => {
  if (alignment) {
    if (alignment === 'middle') {
      return position;
    } else {
      return `${position || 'bottom'}-${alignment}`;
    }
  } else if (position) {
    return `${position}-start`;
  }
};
