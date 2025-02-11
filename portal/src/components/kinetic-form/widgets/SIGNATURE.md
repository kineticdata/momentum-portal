[&#x2B9C; Back to Kinetic Form Widgets](README.md#available-widgets)

## Signature Widget

The signature widget renders a signature element, which opens a modal where the user can draw their signature or type it using a preselected font. The signature is stored as an image attachment field on the form.

```js
// Initialize the Markdown widget
bundle.widgets.Signature({ container, field, config, id });

// Retrieve a reference to the widget's API
bundle.widgets.Signature.get(id);
```

### API

![name=getValue](https://img.shields.io/badge/getValue%28%29-gray)
![type=Function](https://img.shields.io/badge/Function-e66e22)  
Retrieves the current value of the signature.

![name=reset](https://img.shields.io/badge/reset%28%29-gray)
![type=Function](https://img.shields.io/badge/Function-e66e22)  
Resets the signature field, clearing the stored signature.

### Props

The SignatureComponent accepts the following props:

| prop name           | type     | default value                                                  | description                                          |
| ------------------- | -------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `modalTitle`        | `string` | 'Sign your form'                                               | Title of the signature modal.                        |
| `signaturePadLabel` | `string` | 'Signature'                                                    | Label displayed above the signature pad.             |
| `fullNameLabel`     | `string` | 'Full Name\*'                                                  | Label for the full name input field.                 |
| `agreementText`     | `string` | 'I understand this is a legal representation of my signature.' | Agreement text displayed below the signature field.  |
| `savedButtonLabel`  | `string` | 'Save'                                                         | Label for the save button.                           |
| `savedFileName`     | `string` | 'signature_widget'                                             | Name of the saved signature file.                    |
| `buttonLabel`       | `string` | 'Signature'                                                    | Label for the button that opens the signature modal. |
| `clearButtonLabel`  | `string` | 'Clear'                                                        | Label for the button that clears the signature.      |

### Example

```js
bundle.widgets.Signature({
  container: K('section[Signature Widget]').element(),
  field: K('field[Signature]'),
  config: {
    // Disable in review mode
    disabled: K('form').reviewMode(),
    // Title of the signature modal
    modalTitle: 'Sign your form',
    // Label displayed above the signature pad
    signaturePadLabel: 'Signature',
    // Label for the full name input field
    fullNameLabel: 'Full Name*',
    // Agreement text displayed below the signature field
    agreementText:
      'I understand this is a legal representation of my signature.',
    // Label for the save button
    savedButtonLabel: 'Save',
    //  Name of the saved signature file
    savedFileName: 'signature_widget',
    // Label for the button that opens the signature modal
    buttonLabel: 'Signature',
    // Label for the button that clears the signature
    clearButtonLabel: 'Clear',
  },
  id: 'sig',
});
```
