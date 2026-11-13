import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  Input,
  Typography,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  useGetFastDeliveryConfigQuery,
  useUpdateFastDeliveryConfigMutation,
} from "../../../services/api";

export function FastDeliveryConfigDialog({ open, handleOpen }) {
  const { data, isLoading, error } = useGetFastDeliveryConfigQuery(undefined, {
    skip: !open,
  });
  const [updateConfig, { isLoading: isSaving }] =
    useUpdateFastDeliveryConfigMutation();
  const [formData, setFormData] = useState({
    endpoint: "",
    apiKey: "",
    feePath: "amount",
    enabled: false,
  });

  useEffect(() => {
    if (!data?.config) return;
    setFormData((current) => ({
      ...current,
      endpoint: data.config.endpoint ?? "",
      feePath: data.config.feePath ?? "amount",
      enabled: Boolean(data.config.enabled),
    }));
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateConfig({
        endpoint: formData.endpoint.trim(),
        feePath: formData.feePath.trim(),
        enabled: formData.enabled,
        ...(formData.apiKey.trim() ? { apiKey: formData.apiKey.trim() } : {}),
      }).unwrap();
      setFormData((current) => ({ ...current, apiKey: "" }));
      toast.success("Fast delivery API settings saved.");
      handleOpen(false);
    } catch (saveError) {
      console.error("Could not save fast delivery API settings:", saveError);
      toast.error(
        saveError?.data?.message || "Could not save fast delivery settings.",
      );
    }
  };

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-full">
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Fast delivery API
            </Typography>
            <Typography variant="small" color="gray">
              The backend sends a POST request with a Bearer token and the
              selected delivery address. The response must contain the fee in
              Nigerian naira at the response field path below.
            </Typography>
            {isLoading && <Typography>Loading settings…</Typography>}
            {error && (
              <Typography color="red">
                Could not load current API settings. Please retry.
              </Typography>
            )}
            <Input
              label="Quote API endpoint (HTTPS)"
              type="url"
              value={formData.endpoint}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  endpoint: event.target.value,
                }))
              }
              required={formData.enabled}
            />
            <Input
              label="API key / Bearer token"
              type="password"
              autoComplete="new-password"
              value={formData.apiKey}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  apiKey: event.target.value,
                }))
              }
              placeholder={
                data?.config?.hasApiKey
                  ? "Token saved on the backend; enter a new value to replace it"
                  : "Enter provider API key"
              }
            />
            <Input
              label="Fee field path in JSON response"
              value={formData.feePath}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  feePath: event.target.value,
                }))
              }
              required
            />
            <label className="flex items-center gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    enabled: event.target.checked,
                  }))
                }
              />
              Enable fast delivery quotes
            </label>
            <div className="flex justify-end gap-3">
              <Button
                variant="text"
                type="button"
                onClick={() => handleOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-mainGreen"
                type="submit"
                disabled={isLoading || isSaving || Boolean(error)}
              >
                {isSaving ? "Saving…" : "Save API settings"}
              </Button>
            </div>
          </CardBody>
        </form>
      </Card>
    </Dialog>
  );
}
