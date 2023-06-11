import CreateMachineButton from "components/CreateMachineButton";
import MachineCard from "components/MachineCard";
import { useEffect, useState } from "react";
import API from "utils/api";

interface Machine {
  name: string;
  memory: string;
  vcpu: string;
  disks: { id: number; size: number }[];
  nics: { id: number; ip: string; macAddress: string };
}

export default function Home() {
  const [machines, setMachines] = useState<Machine[]>([]);

  const getMachines = async () => {
    try {
      const machine = await API.get("/api/machine");
      setMachines(machine.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMachines();
  }, []);

  return (
    <main className="w-full mt-28">
      <div className="flex justify-between max-w-[75rem] mx-auto mb-8 px-[2rem]">
        <h1 className="text-[1.5rem] font-poppins">Crie sua máquina virtual: </h1>
        <CreateMachineButton setMachines={setMachines} />
      </div>
      <div className="place-items-center grid grid-cols-[repeat(auto-fit,minmax(21.8rem,1fr))] max-w-[75rem] mx-auto mb-10 gap-y-[3rem] gap-x-[1rem] px-[2rem] services:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
        {machines?.map((item, index) => {
          return <MachineCard machine={item} key={index} />;
        })}
      </div>
    </main>
  );
}
