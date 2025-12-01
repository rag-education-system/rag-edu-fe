import { fail } from "@sveltejs/kit";
import { AxiosError, type AxiosResponse } from "axios";
import { toast } from "svelte-sonner";
import type { SuperValidated } from "sveltekit-superforms";
import type { SuperFormData } from "sveltekit-superforms/client";

export function getMessageAxios(m: unknown) {
      function showErrorToastAxios(err: unknown) {
            toast.error(err instanceof AxiosError ? err?.response?.data?.message : 'Something went wrong');
      }
      function showSuccessToastAxios(data: AxiosResponse) {
            toast.success(data?.data?.message || 'Success', {
                  action: {
                        label: 'Tutup',
                        onClick: () => {
                              console.info('Employee created successfully');
                        }
                  },
                  duration: 3000
            });
      }
      return {
            error: () => showErrorToastAxios(m),
            success: () => showSuccessToastAxios(m as AxiosResponse)
      };
}

/**
 * get message form
 * @param form - form data
 * @param formData - form data
 * @returns boolean - true if success, false if error
 */
export function getMessageForm<T extends Record<string, unknown>>(
      form: SuperValidated<T, { error: boolean; message: string }>,
      formData: SuperFormData<T>
): boolean {
      if (form.valid === false) {
            formData.set(form.data);
            toast.error(form.message?.message ?? 'Something went wrong', { duration: 5000 });
            return false;
      }

      toast.success(form.message?.message ?? 'Success', { duration: 5000 });
      return true;
}


export function getMessageFormError<T extends Record<string, unknown>>(
	form: SuperValidated<T, { error: boolean; message: string }>,
	res: any
) {
	// Filter out non-serializable data (like File objects) before returning
	const serializableData: Record<string, unknown> = {};
	if (form.data) {
		Object.keys(form.data).forEach((key) => {
			const value = form.data[key as keyof T];
			// Exclude File objects and other non-serializable types
			if (!(value instanceof File)) {
				serializableData[key] = value;
			}
		});
	}

	return fail(400, {
		form: {
			data: serializableData,
			valid: false,
			errors: res?.errors || form.errors,
			message: { error: true, message: res?.message || form.message?.message }
		}
	});
}