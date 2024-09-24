"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { registerPatient } from "@/lib/actions/patient.action";

const RegisterForm = ({user}: {user: User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;

    if(values.identificationDocument&&values.identificationDocument.length > 0){
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type
      })

      formData = new FormData()
      formData.append('blobFile', blobFile)
      formData.append('fileName', values.identificationDocument[0].name)
      
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }
      //@ts-expect-error not sure why gender still optional
      const patient = await registerPatient(patientData)
      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>

          <CustomFormField
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            fieldType={FormFieldType.INPUT}
            control={form.control}
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="email"
              label="Email"
              placeholder="johndoe@mail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
              fieldType={FormFieldType.INPUT}
              control={form.control}
            />

            <CustomFormField
              name="phone"
              label="Phone Number"
              placeholder="(+62) 898-3213-8933"
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="birthDate"
              label="Date of Birth"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
            />

            <CustomFormField
              name="gender"
              label="Gender"
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              renderSkeleton={(field: ControllerRenderProps) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor="option" className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="address"
              label="Address"
              placeholder="14th Street, New York"
              fieldType={FormFieldType.INPUT}
              control={form.control}
            />

            <CustomFormField
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
              fieldType={FormFieldType.INPUT}
              control={form.control}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's Name"
              fieldType={FormFieldType.INPUT}
              control={form.control}
            />

            <CustomFormField
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(+62) 898-3213-8933"
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="BlueCross BlueShield"
              fieldType={FormFieldType.INPUT}
              control={form.control}
            />

            <CustomFormField
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ABCD1234579"
              fieldType={FormFieldType.INPUT}
              control={form.control}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
            />

            <CustomFormField
              name="currentMedication"
              label="Current Medication"
              placeholder="Ibuprofen 200mg, Paracetamol 500mg"
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="familyMedicalHistory"
              label="Family Medical History"
              placeholder="Mother had brain cancer, Father had heart disease"
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
            />

            <CustomFormField
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="Appendectomy, Tonsillectomy"
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an identification type"
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            name="identificationNumber"
            label="Identification Number"
            placeholder="1234556677"
            fieldType={FormFieldType.INPUT}
            control={form.control}
          />

          <CustomFormField
            name="identificationDocument"
            label="Scanned copy of identification document"
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            renderSkeleton={(field: ControllerRenderProps) => (
              <FormControl>
								<FileUploader files={field.value} onChange={field.onChange}/>
							</FormControl>
            )}
          />
        </section>

				<section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>

					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="treatmentConsent"
						label="I consent to treatment"
					/>
					
					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="disclosureConsent"
						label="I consent to disclosure of information"
					/>

					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="privacyConsent"
						label="I consent to privacy policy"
					/>

				</section>
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
