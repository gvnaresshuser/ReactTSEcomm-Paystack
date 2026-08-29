declare module "@paystack/inline-js" {
  interface PaystackTransaction {
    reference: string;
    status?: string;
    transaction?: string;
  }

  interface PaystackConfig {
    onSuccess?: (transaction: PaystackTransaction) => void;
    onCancel?: () => void;
  }

  class PaystackPop {
    resumeTransaction(
      accessCode: string,
      config?: PaystackConfig,
    ): void;
  }

  export default PaystackPop;
}