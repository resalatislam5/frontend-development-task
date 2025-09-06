"use client";
import { mockManagers, skillsByDepartment } from "@/constant";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
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

const HomeMultiFrom = () => {
  const [steps, setSteps] = useState(0);
  const [showManagerSearch, setShowManagerSearch] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [workTime, setWorkTime] = useState([9, 17]); // default: 9AM–5PM
  const [workPreference, setWorkPreference] = useState([0, 10]); // default: 9AM–5PM
  return (
    <div>
      {steps == 0 && (
        <FromLayout title="Step 1: Personal Info">
          <div className="space-y-2">
            <Label htmlFor="name">Name:</Label>
            <Input id="name" placeholder="Enter Your Full Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Email">Email:</Label>
            <Input id="email" placeholder="Enter Your Email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number:</Label>
            <Input id="number" placeholder="Enter Your Phone Number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Number:</Label>
            <Input
              id="date"
              className="!w-full"
              type="date"
              placeholder="Enter Your Date Of Birth"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="file">Photo:</Label>
            <label
              className=" h-36 flex justify-center items-center cursor-pointer border rounded-lg border-dashed"
              htmlFor="file"
            >
              <MdOutlineFileUpload className="text-5xl" />
              <input type="file" id="file" className="hidden" />
            </label>
          </div>
          <div />
          <Button variant={"secondary"} onClick={() => setSteps(1)}>
            Next
          </Button>
        </FromLayout>
      )}
      {steps == 1 && (
        <FromLayout title="Step 2: Job Details">
          <div className="space-y-2">
            <Label htmlFor="department">Department:</Label>
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
          <div className="space-y-2">
            <Label htmlFor="position">Position:</Label>
            <Input id="position" placeholder="Enter Your Position Title " />
          </div>
          <div className="space-y-2">
            <Label htmlFor="starting-date">Starting Date:</Label>
            <Input id="starting-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-type">Job Type:</Label>
            <RadioGroup className="flex mt-6" defaultValue="full-time">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary Expectation:</Label>
            <Input id="salary" placeholder="Salary Expectation" />
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="manager">Manager:</Label>
            <Command className="rounded-lg border shadow-md ">
              <CommandInput
                onFocus={() => setShowManagerSearch(true)}
                onBlur={() => setShowManagerSearch(false)}
                placeholder="Type a command or search..."
              />
              {showManagerSearch && (
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup
                    heading="Suggestions"
                    className="absolute bg-white w-full"
                    onClick={() => setShowManagerSearch(false)}
                  >
                    {mockManagers.map((item) => (
                      <CommandItem key={item.id}>
                        <span>{item.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
            </Command>
          </div>
          <Button variant={"secondary"} onClick={() => setSteps(0)}>
            Preview
          </Button>
          <Button variant={"secondary"} onClick={() => setSteps(2)}>
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
    </div>
  );
};

export default HomeMultiFrom;
