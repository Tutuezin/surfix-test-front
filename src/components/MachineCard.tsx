import { Switch, Modal, Form, Input } from "antd";
import API from "utils/api";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";

interface Props {
  machine: Machine;
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
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

interface DiskSize {
  value: string;
}

interface Nic {
  ip: string;
  macAddress: string;
}

export default function MachineCard({ machine, setMachines }: Props) {
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const onChange = async (checked: boolean) => {
    try {
      await API.put(`api/machine/${machine.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  /* DISK */
  const createDisk = async (id: number, values: DiskSize) => {
    const body = {
      size: values.value,
    };

    try {
      const response = await API.post(`/api/disk/${id}`, body);

      setMachines((machines) =>
        machines.map((item) =>
          item.id === id ? { ...item, disks: [...item.disks, response.data] } : item,
        ),
      );
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  const updateDisk = async (id: number, size: number, values: DiskSize) => {
    try {
      let diskSize = size;
      let newDisk = Number(values.value);

      if (newDisk > diskSize) {
        newDisk -= diskSize;

        const body = {
          incrementSize: newDisk,
        };

        const response = await API.put(`/api/disk/${id}/increment`, body);

        /* setMachines((machines) =>
          machines.map((item) =>
            item.id === machine.id
              ? {
                  ...item,
                  disks: [item.disks.map((item) => (item.id === id ? "" : "")), response.data],
                }
              : item,
          ),
        ); */
        form.resetFields();
      } else {
        newDisk += -diskSize;

        const body = {
          decrementSize: newDisk * -1,
        };

        await API.put(`/api/disk/${id}/decrement`, body);
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDisk = async (id: number) => {
    try {
      await API.delete(`/api/disk/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  /* NIC */

  const createNic = async (id: number, values: Nic) => {
    const body = {
      ip: values.ip,
      macAddress: values.macAddress,
    };

    try {
      const response = await API.post(`/api/nic/${id}`, body);

      setMachines((machines) =>
        machines.map((item) =>
          item.id === id ? { ...item, nics: [...item.nics, response.data] } : item,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNic = async (id: number) => {
    try {
      await API.delete(`/api/nic/${id}`);
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
          <div className="flex items-center gap-1">
            <h3>Discos</h3>
            <AiOutlinePlusCircle
              className="text-green text-[1.3rem] cursor-pointer"
              onClick={() => {
                confirm({
                  icon: <></>,
                  title: "Adicionar disco",
                  okText: "Confirmar",
                  cancelText: "Cancelar",
                  onOk(_) {
                    form.submit();
                  },
                  onCancel: () => form.resetFields(),
                  maskClosable: true,
                  content: (
                    <Form
                      form={form}
                      className="form"
                      layout="vertical"
                      onFinish={(values) => {
                        createDisk(machine.id, values);
                        Modal.destroyAll();
                      }}
                    >
                      <Form.Item
                        name="value"
                        label="Valor:"
                        required={false}
                        rules={[
                          {
                            required: true,
                            message: "Tamanho do disco é necessário!",
                          },
                        ]}
                      >
                        <Input className="input" />
                      </Form.Item>
                    </Form>
                  ),
                });
              }}
            />
          </div>
          {machine.disks.map((item, index) => {
            return (
              <div key={index} className="flex items-center gap-1">
                <h3 className="">• {item.size}gb</h3>
                <AiOutlineEdit
                  className="text-yellow text-[1.2rem] cursor-pointer"
                  onClick={() => {
                    confirm({
                      icon: <></>,
                      title: "Mudar tamanho do disco",
                      okText: "Confirmar",
                      cancelText: "Cancelar",
                      onOk(_) {
                        form.submit();
                      },
                      onCancel: () => form.resetFields(),
                      maskClosable: true,
                      content: (
                        <Form
                          form={form}
                          className="form"
                          layout="vertical"
                          onFinish={(values) => {
                            updateDisk(item.id, item.size, values);
                            Modal.destroyAll();
                          }}
                        >
                          <Form.Item
                            name="value"
                            label="Valor:"
                            required={false}
                            rules={[
                              {
                                required: false,
                              },
                            ]}
                          >
                            <Input className="input" />
                          </Form.Item>
                        </Form>
                      ),
                    });
                  }}
                />

                <AiOutlineDelete
                  className="text-red-600 text-[1.2rem] cursor-pointer"
                  onClick={() => {
                    deleteDisk(item.id);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-col mb-[2rem] text-[1.2rem] font-poppins font-[500] text-lblue services:text-[1.2rem]">
          <div className="flex items-center gap-1">
            <h3>Placas de Rede</h3>
            <AiOutlinePlusCircle
              className="text-green text-[1.3rem] cursor-pointer"
              onClick={() => {
                confirm({
                  icon: <></>,
                  title: "Adicionar nova placa de rede",
                  okText: "Confirmar",
                  cancelText: "Cancelar",
                  onOk(_) {
                    form.submit();
                  },
                  onCancel: () => form.resetFields(),
                  maskClosable: true,
                  content: (
                    <Form
                      form={form}
                      className="form"
                      layout="vertical"
                      onFinish={(values) => {
                        createNic(machine.id, values);
                        Modal.destroyAll();
                      }}
                    >
                      <Form.Item
                        name="ip"
                        label="Ip:"
                        required={false}
                        rules={[
                          {
                            required: true,
                            message: "Ip é necessário!",
                          },
                        ]}
                      >
                        <Input className="input" />
                      </Form.Item>
                      <Form.Item
                        name="macAddress"
                        label="Mac:"
                        required={false}
                        rules={[
                          {
                            required: true,
                            message: "Endereço Mac é necessário!",
                          },
                        ]}
                      >
                        <Input className="input" />
                      </Form.Item>
                    </Form>
                  ),
                });
              }}
            />
          </div>
          {machine.nics.map((item, index) => {
            return (
              <div key={index}>
                <div className="flex items-center gap-1">
                  <h3>• Ip: {item.ip}</h3>
                  <AiOutlineDelete
                    className="text-red-600 text-[1.25rem] cursor-pointer"
                    onClick={() => {
                      deleteNic(item.id);
                    }}
                  />
                </div>
                <h3 className="mb-2">• Mac: {item.macAddress}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
