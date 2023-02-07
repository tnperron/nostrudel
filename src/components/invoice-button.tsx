import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { requestProvider } from "webln";
import { getReadableAmount, parsePaymentRequest } from "../helpers/bolt11";
import { useAsync } from "react-use";

export type InvoiceButtonProps = {
  paymentRequest: string;
};
export const InvoiceButton = ({ paymentRequest }: InvoiceButtonProps) => {
  const { value: invoice, error } = useAsync(async () =>
    parsePaymentRequest(paymentRequest)
  );
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      const provider = await requestProvider();
      await provider.enable();
      const response = await provider.sendPayment(paymentRequest);
      if (response.preimage) {
        console.log("Paid");
      }
    } catch (e) {
      console.log("Failed to pay invoice");
      console.log(e);
    }
    setLoading(false);
  };

  if (error) {
    <>{paymentRequest}</>;
  }

  return (
    <Button
      colorScheme="yellow"
      variant="outline"
      onClick={handleClick}
      isLoading={loading}
    >
      ⚡ Invoice for{" "}
      {invoice?.amount ? getReadableAmount(invoice.amount) : "♾️"}
    </Button>
  );
};
