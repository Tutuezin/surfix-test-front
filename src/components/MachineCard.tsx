import { Switch } from "antd";
import API from "utils/api";

interface Props {
  machine: Machine;
}

interface Machine {
  id: number;
  name: string;
  memory: string;
  vcpu: string;
  state: boolean;
  disks: { id: number; size: number }[];
  nics: { id: number; ip: string; macAddress: string }[];
}

export default function MachineCard({ machine }: Props) {
  const onChange = async (checked: boolean) => {
    try {
      await API.put(`api/machine/${machine.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[21.8rem] min-h-[22.9rem] bg-white rounded-md shadow-bxs tablet:w-[80%] tablet:min-w-[19.5rem] services:w-[70%] services:min-w-[15rem]">
      <div className="px-[1.8rem] py-[1.8rem]">
        <div className="flex flex-col mb-[1rem] gap-2">
          <h2 className="text-[1.3rem] font-poppins font-[600] text-blue services:text-[1.2rem]">
            {machine.name}
          </h2>
          <div className="flex gap-2 items-center">
            <h3 className="text-[1.2rem] font-poppins font-[500] text-lblue services:text-[1.2rem]">
              On/Off:
            </h3>
            <Switch className="w-[10%]" defaultChecked={machine.state} onChange={onChange} />
          </div>
        </div>
        <h3 className="mb-[.5rem] text-[1.2rem] font-poppins font-[500] text-lblue services:text-[1.2rem]">
          Memoria: {machine.memory}gb
        </h3>
        <h3 className="mb-[.5rem] text-[1.2rem] font-poppins font-[500] text-lblue services:text-[1.2rem]">
          Vcpu: {machine.vcpu}/16
        </h3>
        <div className="flex flex-col mb-[.5rem] text-[1.2rem] font-poppins font-[500] text-lblue services:text-[1.2rem]">
          Discos:
          {machine.disks.map((item, index) => {
            return (
              <h3 key={index} className="cursor-pointer">
                {item.size}
              </h3>
            );
          })}
        </div>
        <div className="flex flex-col mb-[2rem] text-[1.2rem] font-poppins font-[500] text-lblue services:text-[1.2rem]">
          Placas de Rede:
          {machine.nics.map((item, index) => {
            return (
              <div key={index}>
                <h3>Ip: {item.ip}</h3>
                <h3>Mac: {item.macAddress}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
