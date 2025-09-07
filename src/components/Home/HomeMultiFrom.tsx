"use client";
import { employeeFromData, mockManagers, skillsByDepartment } from "@/constant";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
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
    birth: z.string().nonempty("Date of Birth is required"),
    img: z.any().optional(), // allows undefined
  }),
  job_details: z.object({
    department: z.string().nonempty("department is Required"),
    position_title: z.string().nonempty("position title is Required"),
    start_date: z.string().nonempty("start date is Required"),
    job_type: z.string().nonempty("job type is Required"),
    salary_expectation: z.string().nonempty("salary expectation is Required"),
    manager: z.string().nonempty("manage is Required"),
  }),

  // skills: z.object({
  //   primary_skills: [
  //     {
  //       name: z.string(),
  //       experience: z.string(),
  //     },
  //   ],

  //   work_hours: z.string(),
  //   work_preference: z.string(),
  //   extra_note: z.string(),
  // }),
  // contact: z.object({
  //   name: z.string(),
  //   relationship: z.string(),
  //   number: z.string(),
  //   age: z.string(),
  //   guardian_name: z.string(),
  //   guardian_number: z.string(),
  // }),
});

type employeeFromDataTypes = z.infer<typeof employeeFromDataSchema>;
const HomeMultiFrom = () => {
  const [steps, setSteps] = useState(0);
  const [showManagerSearch, setShowManagerSearch] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [workTime, setWorkTime] = useState([9, 17]); // default: 9AM–5PM
  const [workPreference, setWorkPreference] = useState([10]); // default: 0-10%
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  // handle from using react-hooks-from and zod

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm<employeeFromDataTypes>({
    resolver: zodResolver(employeeFromDataSchema),
    mode: "onChange",
    defaultValues: employeeFromData,
  });
  const nextStep = async () => {
    let valid = false;

    console.log(getValues(), errors, trigger());
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
      // valid = await trigger([
      //   "skills.primary_skills",
      //   "skills.work_hours",
      //   "skills.work_preference",
      //   "skills.extra_note",
      // ]);
    } else if (steps === 3) {
      // Steps 4 = contact fields
      // valid = await trigger([
      //   "contact.name",
      //   "contact.relationship",
      //   "contact.number",
      //   "contact.age",
      //   "contact.guardian_name",
      //   "contact.guardian_number",
      // ]);
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
                setValue("job_details.department", val, {
                  shouldValidate: true, // triggers validation immediately
                  shouldDirty: true, // marks the field as dirty
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
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
                <RadioGroupItem value="full-time" id="full-time" />
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
            <Command className="rounded-lg border shadow-md ">
              <CommandInput
                onFocus={() => setShowManagerSearch(true)}
                onBlur={() => setShowManagerSearch(false)}
                placeholder="Type a command or search..."
                value={watch("job_details.manager")}
                onValueChange={(val) =>
                  setValue("job_details.manager", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
              {showManagerSearch && (
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup
                    heading="Suggestions"
                    className="absolute bg-white w-full"
                    onClick={() => setShowManagerSearch(false)}
                    {...register("job_details.manager")}
                  >
                    {mockManagers.map((item) => (
                      <CommandItem
                        value={item.name} // set the value prop
                        onSelect={(val) =>
                          setValue("job_details.manager", val, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        key={item.id}
                      >
                        <span>{item.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
              {errors.job_details?.manager && (
                <p className="text-[10px] text-red-500">
                  {errors.job_details.manager.message}
                </p>
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
          {skillsByDepartment.Engineering.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <Checkbox
                onCheckedChange={(checked) => {
                  if (checked) {
                    if (skills.length > 2) {
                      return alert("maximum 3 item added");
                    }
                    setSkills((prev) => [...prev, e]);
                  } else {
                    const removeSkill = skills.filter((item) => !(item === e));
                    setSkills(removeSkill);
                  }
                }}
                id={e}
              />
              <div className="grid gap-2 w-full">
                <Label htmlFor={e}>{e}</Label>
                {}
                {skills[skills.findIndex((item) => item === e)] === e && (
                  <Input placeholder="What Is Your Experience?" />
                )}
              </div>
            </div>
          ))}
          <div className="sm:col-span-2">
            <Label>Preferred Working Hours </Label>
            <Slider
              value={workTime}
              onValueChange={setWorkTime}
              min={0}
              max={24}
              step={1}
              className="mt-6 mb-3"
            />
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Start: {workTime[0]}:00</span>
              <span>End: {workTime[1]}:00</span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Remote Work Preference </Label>
            <Slider
              value={workPreference}
              onValueChange={setWorkPreference}
              max={100}
              step={1}
              className=" mt-6 mb-3"
            />
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>Start: {0}%</span>
              <span>End: {workPreference[1]}%</span>
            </div>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="Extra_Notes">Extra Notes</Label>
            <Textarea id="Extra_Notes" rows={5} className="" />
          </div>
          <Button variant={"secondary"} onClick={() => setSteps(2)}>
            Preview
          </Button>
          <Button variant={"secondary"} onClick={() => setSteps(3)}>
            Next
          </Button>
        </FromLayout>
      )}
      {steps === 3 && (
        <FromLayout title="Step 4: Emergency Contact">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Contact Name:</Label>
            <Input id="contact-name" placeholder="Enter Your Phone Number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number:</Label>
            <Input id="number" placeholder="Enter Your Phone Number" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="">Relationship:</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <div className="flex gap-2 items-center">
              <Checkbox />
              Are You Under 21
            </div>
          </div>
          <div className="sm:col-span-2 flex gap-5">
            <Input id="number" placeholder="Enter Your Phone Number" />
            <Input id="number" placeholder="Enter Your Phone Number" />
          </div>
          <Button variant={"secondary"} onClick={() => setSteps(3)}>
            Preview
          </Button>
          <Button variant={"secondary"} onClick={() => setSteps(4)}>
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

// const employeeFromDataTypes = z.object( {
//   person: z.object({
//     name: z.string(),
//     email: z.string(),
//     number: z.string(),
//     birth: z.string(),
//     img: z.string(),
//   }),
//   job_details: {
//     department: z.string(),
//     position_title: z.string(),
//     start_date: z.string(),
//     job_type: z.string(),
//     salary_expectation: z.string(),
//     manager: z.string(),
//   }

//   skills: {
//     primary_skills: {
//       name: z.string(),
//       experience: z.string(),
//     }[];

//     work_hours: z.string(),
//     work_preference: z.string(),
//     extra_note: z.string(),
//   };
//   contact: {
//     name: z.string(),
//     relationship: z.string(),
//     number: z.string(),
//     age: z.string(),
//     guardian_name?: z.string(),
//     guardian_number?: z.string(),
//   };
// })
