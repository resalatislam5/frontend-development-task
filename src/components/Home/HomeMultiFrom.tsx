"use client";
import { employeeFromData, mockManagers, skillsByDepartment } from "@/constant";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineFileUpload } from "react-icons/md";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

const FromLayout = ({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children: ReactNode;
}) => {
  return (
    <section
      className={cn(
        "bg-white shadow-lg md:min-w-[700px] sm:p-10 p-5 rounded-lg mt-10",
        className
      )}
    >
      <h1 className="text-3xl font-semibold">{title}</h1>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-5 mt-5">
        {children}
      </div>
    </section>
  );
};

export type DepartmentType =
  | "Engineering"
  | "Marketing"
  | "Sales"
  | "HR"
  | "Finance";
const employeeFromDataSchema = z.object({
  person: z.object({
    name: z
      .string()
      .nonempty("Name is Required")

      .min(2, "Name Must be 2 characters"),
    email: z.email().nonempty("Email is Required"),
    number: z
      .string()
      .nonempty("Phone number is required")
      .regex(
        /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/,
        "Phone number must be in format +1-123-456-7890"
      ),
    birth: z
      .string()
      .nonempty("Date of Birth is required")
      .refine((date) => {
        const dob = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }, "You must be at least 18 years old"),
    img: z.any().optional(), // allows undefined
  }),
  job_details: z.object({
    department: z.enum(["Engineering", "Marketing", "Sales", "HR", "Finance"]),
    position_title: z.string().nonempty("position title is Required"),
    start_date: z
      .string()
      .nonempty("start date is Required")
      .refine((dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // remove time part
        const startDate = new Date(dateStr);
        const maxFutureDate = new Date();
        maxFutureDate.setDate(today.getDate() + 90);

        return startDate >= today && startDate <= maxFutureDate;
      }, "Start Date must be today or within 90 days from today"),
    job_type: z.string().nonempty("job type is Required"),
    salary_expectation: z.string().nonempty("salary expectation is Required"),
    manager: z.string().nonempty("manage is Required"),
  }),

  skills: z.object({
    primary_skills: z
      .array(
        z.object({
          name: z.string().nonempty("name is Required"),
          experience: z.string().nonempty("experience is Required"),
        })
      )
      .max(3, "You can select up to 3 skills only"), // ✅ max 3 enforced

    work_hours: z.array(z.number()).nonempty("work hours is Required"),
    work_preference: z
      .array(z.number())
      .nonempty("work preference is Required"),
    extra_note: z
      .string()
      .max(500, "max 500 characters")
      .optional()
      .refine((val) => !val || val.trim().length > 0, {
        message: "Extra note cannot be empty if provided",
      }),
  }),
  contact: z.object({
    name: z.string().nonempty("Name is Required"),
    relationship: z.string().nonempty("Relation ship is Required"),
    number: z
      .string()
      .nonempty("Phone number is required")
      .regex(
        /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/,
        "Phone number must be in format +1-123-456-7890"
      ),
    age: z.boolean(),
    guardian_name: z.string().optional(),
    guardian_number: z.string().optional(),
  }),
});

type employeeFromDataTypes = z.infer<typeof employeeFromDataSchema>;
const HomeMultiFrom = () => {
  const [steps, setSteps] = useState(0);
  const [showManagerSearch, setShowManagerSearch] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  // handle from using react-hooks-from and zod

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
    control,
  } = useForm<employeeFromDataTypes>({
    resolver: zodResolver(employeeFromDataSchema),
    mode: "onChange",
    defaultValues: employeeFromData,
  });
  const nextStep = async () => {
    let valid = false;

    console.log(getValues(), errors);
    if (steps === 0) {
      // Steps 1 = person fields

      valid = await trigger([
        "person.name",
        "person.email",
        "person.number",
        "person.birth",
        "person.img",
      ]);
    } else if (steps === 1) {
      // Steps 2 = job_details fields
      valid = await trigger([
        "job_details.department",
        "job_details.position_title",
        "job_details.start_date",
        "job_details.job_type",
        "job_details.salary_expectation",
        "job_details.manager",
      ]);
    } else if (steps === 2) {
      // Steps 3 = skills fields
      valid = await trigger([
        "skills.primary_skills",
        "skills.work_hours",
        "skills.work_preference",
        "skills.extra_note",
      ]);
    } else if (steps === 3) {
      // Steps 4 = contact fields
      valid = await trigger([
        "contact.name",
        "contact.relationship",
        "contact.number",
        "contact.age",
        "contact.guardian_name",
        "contact.guardian_number",
      ]);
    }

    if (valid) setSteps((s) => s + 1);
  };
  console.log(imgPreview);

  return (
    <form>
      {steps == 0 && (
        <FromLayout title="Step 1: Personal Info">
          <div className="space-y-2">
            <Label htmlFor="name">Name:</Label>
            <Input
              {...register("person.name")}
              id="name"
              placeholder="Enter Your Full Name"
            />
            {errors.person?.name && (
              <p className="text-[10px] text-red-500">
                {errors.person.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="Email">Email:</Label>
            <Input
              {...register("person.email")}
              id="email"
              placeholder="Enter Your Email"
              type="email"
            />
            {errors.person?.email && (
              <p className="text-[10px] text-red-500">
                {errors.person.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number:</Label>
            <Input
              {...register("person.number")}
              id="number"
              placeholder="Enter Your Phone Number"
            />
            {errors.person?.number && (
              <p className="text-[10px] text-red-500">
                {errors.person.number.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date of Birth:</Label>
            <Input
              {...register("person.birth")}
              id="date"
              className="!w-full"
              type="date"
              placeholder="Enter Your Date Of Birth"
            />
            {errors.person?.birth && (
              <p className="text-[10px] text-red-500">
                {errors.person.birth.message}
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <p>Photo:</p>
            {imgPreview && (
              <Image
                width={200}
                height={200}
                src={imgPreview}
                alt="Preview"
                className="w-32 h-32 object-cover mt-2"
              />
            )}
            <label
              className=" h-36 flex justify-center items-center cursor-pointer border rounded-lg border-dashed"
              htmlFor="file"
            >
              <MdOutlineFileUpload className="text-5xl" />
              <input
                type="file"
                id="file"
                className="hidden"
                accept="image/*"
                required
                {...register("person.img", {
                  setValueAs: (files: FileList | null) => {
                    const file = files?.[0];
                    if (file) setImgPreview(URL.createObjectURL(file)); // only create URL if file exists
                    return file;
                  },
                })}
              />
            </label>
            {errors.person?.img && (
              <p className="text-[10px] text-red-500">
                {errors.person.img?.message as string}
              </p>
            )}
          </div>
          <div />
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => nextStep()}
          >
            Next
          </Button>
        </FromLayout>
      )}
      {steps == 1 && (
        <FromLayout title="Step 2: Job Details">
          <div className="space-y-2">
            <Label htmlFor="department">Department:</Label>
            <Select
              onValueChange={(val) =>
                setValue("job_details.department", val as DepartmentType, {
                  shouldValidate: true, // triggers validation immediately
                  shouldDirty: true, // marks the field as dirty
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            {errors.job_details?.department && (
              <p className="text-[10px] text-red-500">
                {errors.job_details.department.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position:</Label>
            <Input
              {...register("job_details.position_title")}
              id="position"
              placeholder="Enter Your Position Title "
            />
            {errors.job_details?.position_title && (
              <p className="text-[10px] text-red-500">
                {errors.job_details.position_title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="starting-date">Starting Date:</Label>
            <Input
              {...register("job_details.start_date")}
              id="starting-date"
              type="date"
            />
            {errors.job_details?.start_date && (
              <p className="text-[10px] text-red-500">
                {errors.job_details.start_date.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-type">Job Type:</Label>
            <RadioGroup
              onValueChange={(val) =>
                setValue("job_details.job_type", val, {
                  shouldValidate: true, // triggers validation immediately
                  shouldDirty: true, // marks the field as dirty
                })
              }
              className="flex mt-6"
              defaultValue="full-time"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  defaultChecked
                  value="full-time"
                  id="full-time"
                />
                <Label htmlFor="full-time">Full-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="part-time" id="part-time" />
                <Label htmlFor="part-time">Part-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contract" id="contract" />
                <Label htmlFor="contract">Contract</Label>
              </div>
            </RadioGroup>
            {errors.job_details?.job_type && (
              <p className="text-[10px] text-red-500">
                {errors.job_details.job_type.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary Expectation:</Label>
            <Input
              {...register("job_details.salary_expectation")}
              id="salary"
              placeholder="Salary Expectation"
            />
            {errors.job_details?.salary_expectation && (
              <p className="text-[10px] text-red-500">
                {errors.job_details.salary_expectation.message}
              </p>
            )}
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="manager">Manager:</Label>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Type a command or search..."
                value={watch("job_details.manager") || ""} // controlled by RHF
                onValueChange={(val) => {
                  setValue("job_details.manager", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                onFocus={() => setShowManagerSearch(true)}
              />

              {showManagerSearch && (
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup
                    heading="Suggestions"
                    className="absolute bg-white w-full"
                  >
                    {mockManagers
                      .filter(
                        (item) =>
                          item.department ===
                          getValues("job_details.department")
                      )
                      .map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          onSelect={(val) => {
                            setValue("job_details.manager", val, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setShowManagerSearch(false); // close after select
                          }}
                        >
                          {item.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              )}
            </Command>
          </div>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setSteps(0)}
          >
            Preview
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => nextStep()}
          >
            Next
          </Button>
        </FromLayout>
      )}
      {steps === 2 && (
        <FromLayout title="Step 3: Skills & Preferences">
          {getValues("job_details.department") && (
            <>
              {skillsByDepartment[getValues("job_details.department")]?.map(
                (e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Checkbox
                      onCheckedChange={(checked) => {
                        if (checked) {
                          if (skills.length > 2) {
                            return alert("maximum 3 item added");
                          }
                          setSkills((prev) => [...prev, e]);
                          setValue(
                            `skills.primary_skills.${i}.name`,
                            e as string,
                            {
                              shouldValidate: true, // triggers validation immediately
                              shouldDirty: true, // marks the field as dirty
                            }
                          );
                        } else {
                          const removeSkill = skills.filter(
                            (item) => !(item === e)
                          );
                          setSkills(removeSkill);
                        }
                      }}
                      id={e}
                      checked={skills.includes(e)}
                    />
                    <div className="grid gap-2 w-full">
                      <Label htmlFor={e}>{e}</Label>
                      {}
                      {skills[skills.findIndex((item) => item === e)] === e && (
                        <Input
                          {...register(
                            `skills.primary_skills.${i}.experience` as const
                          )}
                          placeholder="What Is Your Experience?"
                        />
                      )}
                      {errors.skills?.primary_skills?.[i]?.experience && (
                        <p className="text-[10px] text-red-600">
                          {
                            errors.skills?.primary_skills?.[i]?.experience
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}
            </>
          )}
          <div className="sm:col-span-2">
            <Label>Preferred Working Hours </Label>
            <Slider
              value={watch("skills.work_hours")}
              onValueChange={(val) =>
                setValue("skills.work_hours", val as number[], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              min={0}
              max={24}
              step={1}
              className="mt-6 mb-3"
            />
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Start: {watch("skills.work_hours")[0]}00</span>
              <span>End: {watch("skills.work_hours")[1]}:00</span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Remote Work Preference </Label>
            <Slider
              value={watch("skills.work_hours")}
              onValueChange={(val) =>
                setValue("skills.work_preference", val as number[], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              max={100}
              step={1}
              className=" mt-6 mb-3"
            />
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Start: {0}%</span>
              <span>End: {watch("skills.work_hours")[1]}%</span>
            </div>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="Extra_Notes">Extra Notes (optional)</Label>
            <Textarea id="Extra_Notes" rows={5} className="" />
          </div>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setSteps(1)}
          >
            Preview
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => nextStep()}
          >
            Next
          </Button>
        </FromLayout>
      )}
      {steps === 3 && (
        <FromLayout title="Step 4: Emergency Contact">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact Name:</Label>
            <Input
              {...register("contact.name")}
              id="contact-name"
              placeholder="Enter Your Phone Number"
            />
            {errors.contact?.name && (
              <p className="text-[10px] text-red-500">
                {errors.contact.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number:</Label>
            <Input
              id="number"
              {...register("contact.number")}
              placeholder="Enter Your Phone Number"
            />
            {errors.contact?.number && (
              <p className="text-[10px] text-red-500">
                {errors.contact.number.message}
              </p>
            )}
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="">Relationship:</Label>
            <Select
              onValueChange={(val) =>
                setValue("contact.relationship", val as DepartmentType, {
                  shouldValidate: true, // triggers validation immediately
                  shouldDirty: true, // marks the field as dirty
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Sister">Sister</SelectItem>
                <SelectItem value="Brother">Brother</SelectItem>
                <SelectItem value="Uncle">Uncle</SelectItem>
              </SelectContent>
            </Select>
            {errors.contact?.relationship && (
              <p className="text-[10px] text-red-500">
                {errors.contact.relationship.message}
              </p>
            )}
          </div>

          <Controller
            name="contact.age"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2 sm:col-span-2 items-center ">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="ageT"
                  className="cursor-pointer"
                />
                <Label className="cursor-pointer" htmlFor="ageT">
                  Are You Under 21
                </Label>
              </div>
            )}
          />
          {getValues("contact.age") && (
            <div className="sm:col-span-2 flex gap-5">
              <div className="w-full">
                <Input
                  id="number"
                  {...register("contact.guardian_name")}
                  placeholder="Enter Your Phone Number"
                />
                {errors.contact?.guardian_name && (
                  <p className="text-[10px] text-red-500">
                    {errors.contact.guardian_name.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  id="number"
                  {...register("contact.guardian_number")}
                  placeholder="Enter Your Phone Number"
                />
                {errors.contact?.guardian_number && (
                  <p className="text-[10px] text-red-500">
                    {errors.contact.guardian_number.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setSteps(2)}
          >
            Preview
          </Button>
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => nextStep()}
          >
            Next
          </Button>
        </FromLayout>
      )}
      {steps === 4 && (
        <FromLayout title="Step 5: Review & Submit">
          Show all the information the user entered in one place so they can
          review everything before submitting. (read only)
        </FromLayout>
      )}
    </form>
  );
};

export default HomeMultiFrom;
