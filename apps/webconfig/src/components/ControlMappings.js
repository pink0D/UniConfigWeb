// Editable control mappings.
//
// Each entry maps the text shown in a dropdown (label) to the value that is
// written to / read from the config API (value). Edit a label to change what
// users see without touching the stored value; edit a value to change what is
// saved without changing the label. Keep the empty "" entry as the
// "(disabled)" option.

export const INPUT_MAPPING = [
  { label: '(disabled)', value: '' },
  { label: 'STICK L \u2194', value: 'LeftStickX' },
  { label: 'STICK L \u2195', value: 'LeftStickY' },
  { label: 'STICK R \u2194', value: 'RightStickX' },
  { label: 'STICK R \u2195', value: 'RightStickY' },
  { label: 'TRIGGER L', value: 'LeftTrigger' },
  { label: 'TRIGGER R', value: 'RightTrigger' },
];

export const BUTTON_MAPPING = [
  { label: '(disabled)', value: '' },
  { label: '\u2715 (A)', value: 'Cross' },
  { label: '\u25CB (B)', value: 'Circle' },
  { label: '\u25A1 (X)', value: 'Square' },
  { label: '\u25B3 (Y)', value: 'Triangle' },
  { label: 'D-pad \u2191', value: 'DPadUp' },
  { label: 'D-pad \u2193', value: 'DPadDown' },
  { label: 'D-pad \u2190', value: 'DPadLeft' },
  { label: 'D-pad \u2192', value: 'DPadRight' },
  { label: 'L1 (bumper)', value: 'L1' },
  { label: 'R1 (bumper)', value: 'R1' },
  { label: 'L2 (trigger)', value: 'L2' },
  { label: 'R2 (trigger)', value: 'R2' },
  { label: 'L3 (stick)', value: 'L3' },
  { label: 'R3 (stick)', value: 'R3' },
];

export const BRAKE_MAPPING = [
  { label: '(disabled)', value: '' },
  { label: 'TRIGGER L', value: 'LeftTrigger' },
  { label: 'TRIGGER R', value: 'RightTrigger' },
];
