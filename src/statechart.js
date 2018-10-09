export const statechart = {
  initial: 'idle',
  states: {
    idle: { on: { WAKE_UP: 'registering' } },
    registering: { on: { SCAN_PRODUCT: 'registering', ENTER_PRODUCT: 'registering', START_TX: 'paying', ABORT: 'idle' } },
    paying: {
      on: { CANCEL: 'registering', FULLY_PAID: 'printing' },
      initial: 'select_method',
      states: {
        select_method: { on: { CARD: 'card_payment_in_progress', CASH: 'cash_payment_in_progress' } },
        cash_payment_in_progress: {},
        card_payment_in_progress: { on: { FAILURE: 'card_payment_failed' } },
        card_payment_failed: { on: { RETRY: 'card_payment_in_progress' } },
      },
    },
    printing: { on: { FINISHED: 'idle' }, initial: 'selection', states: { selection: {}, print: {}, no_print: {} } },
  },
};
