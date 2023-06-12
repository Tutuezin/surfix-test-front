import { MdAddCircle } from "react-icons/md";
import { Modal, Form, Input } from "antd";
import API from "utils/api";

interface Props {
  setMachines: React.Dispatch<React.SetStateAction<Machine[]>>;
}

interface Machine {
  name: string;
  memory: string;
  vcpu: string;
  disk: string;
  ip: string;
  mac: string;
}

export default function CreateMachineButton({ setMachines }: Props) {
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const createMachine = async (values: Machine) => {
    const body = {
      name: values.name,
      memory: values.memory,
      vcpu: values.vcpu,
      state: false,
      disks: [{ size: values.disk }],
      nics: [{ ip: values.ip, macAddress: values.mac }],
    };

    try {
      const response = await API.post("/api/machine", body);

      setMachines((machine) => [...machine, response.data]);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <MdAddCircle
        className="cursor-pointer text-green text-[2rem]"
        onClick={() => {
          confirm({
            icon: <></>,
            title: "Criar Máquina",
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
                  createMachine(values);
                  Modal.destroyAll();
                }}
              >
                <section>
                  <div className="flex justify-center gap-5 w-full">
                    <Form.Item
                      name="name"
                      label="Nome:"
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Nome da máquina é obrigatório!",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item
                      name="memory"
                      label="Mémoria:"
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Memória da máquina é obrigatória!",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>
                  </div>
                </section>

                <section>
                  <div className="flex justify-center gap-5 w-full">
                    <Form.Item
                      name="vcpu"
                      label="Vcpu:"
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Vcpu da máquina é obrigatória!",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item
                      name="disk"
                      label="Disco:"
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Disco da máquina é obrigatório!",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>
                  </div>
                </section>

                <section>
                  <div className="flex flex-col justify-center gap-5 w-full">
                    <h1>Placas de Rede</h1>
                    <Form.Item
                      name="ip"
                      label="Ip:"
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Ip da máquina é obrigatório!",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>
                    <Form.Item
                      name="mac"
                      label="Endereço Mac:"
                      initialValue={""}
                      required={false}
                      rules={[
                        {
                          required: true,
                          message: "Endereço Mac da máquina é obrigatório!",
                        },
                      ]}
                    >
                      <Input className="input" />
                    </Form.Item>
                  </div>
                </section>
              </Form>
            ),
          });
        }}
      />
    </div>
  );
}
