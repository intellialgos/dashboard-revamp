import { useGetSitesQuery, useUpgradeBoxMutation } from "@/services"
import { ThemeContext } from "@/theme";
import { Button, Card, Col, Form, Input, message, Row, Select, Skeleton, Switch, Table, TableColumnsType, Tag, TimePicker, TimePickerProps, Transfer, TransferProps, Typography } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { TransferItem } from "antd/es/transfer";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import styles from "./index.module.css"

interface DataType {
    id: string;
    name: string;
}

interface Props {
    packages: any[]
}
export const SiteUpgradeTable = ({packages}: Props) => {
    const { currentData, isLoading } = useGetSitesQuery({});
    const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);
    const [ upgradeBox, { isLoading: isUpgrading } ] = useUpgradeBoxMutation();
    const [version, setVersion] = useState<string>("");
    const [boxType, setBoxType] = useState<number>(-1);
    const [time, setTime] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const { appTheme } = useContext(ThemeContext);
    const darkTheme = appTheme === "dark";

    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    const onChoosePackage = (value: any) => {
      const selectedPackage = packages.filter(item => item.fileName == value)[0];
      setTargetKeys([]);
      setVersion(selectedPackage?.version);
      setBoxType(selectedPackage?.boxType);
    }

    const onChangeTime: TimePickerProps['onChange'] = (time, timeString) => {
      setTime(timeString);
    };

    const columns: TableColumnsType<DataType> = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        dataIndex: 'name',
        title: 'Name',
      },
      {
        title: 'Box Type',
        dataIndex: 'boxType',
        render: (value) => <Tag color={(value == 1) ? "orange" : "cyan"}> { (value == 1) ? "Lite Version" : "Standard Version" } </Tag>
      },
    ];

    const filterOption = (input: string, item: DataType) => item.id?.includes(input) || item.name?.includes(input);
    const onsubmit = async (fromData: any) => {
      if ( targetKeys.length > 0 ) {
        const data = {
          siteId: targetKeys,
          fwVersion: version,
          fwPackageBlobPath: fromData?.package,
          fwPackageCompressFormat: "zip",
          executeTime: time
        }

        const res = await upgradeBox(data);
        if (res) {
          if (res?.data) {
            messageApi.open({
              type: "success",
              content: "Upgraded Successfully !",
            });
            form.resetFields();
            setTargetKeys([]);
          } else {
            messageApi.open({
              type: "error",
              content: "There was an error.",
            });
          }
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Please select sites to upgrade",
        });
      }
    }


    return (
    <Skeleton loading={isLoading}>
      {contextHolder}
        <Row>
            <Col span={24}>
                <Card
                    title="Choose a package"
                    style={{ marginBottom: 20, background:`${darkTheme ? " #0C183B" :"" }`  }}
                >
                    <Form
                        layout="inline"
                        onFinish={onsubmit}
                        disabled={isUpgrading}
                        form={form}
                    >
                        <Form.Item
                            label="Package Name"
                            name={'package'}
                            rules={[ { required: true, message: "Please choose a package" } ]}
                        >
                            <Select
                                className="select_input"
                                style={{ width: 300, background:`${darkTheme ? " #0C183B" :"" }`  }}
                                onChange={onChoosePackage}
                                options={packages ? packages.map((item) => ({
                                    label: `${item.fileName} (${ (item.boxType == 1) ? "Lite Version" : "Standard Version" })`,
                                    value: item.fileName
                                })) : []}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Package Version"
                        >
                            <Input className={styles.input_bg} readOnly value={version} />
                        </Form.Item>
                        <Form.Item
                          label="Upgrade Time"
                          name={'time'}
                          rules={[ { required: true, message: "Please choose time" } ]}
                        >
                            <TimePicker className={styles.input_bg} onChange={onChangeTime} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpgrading}
                        >
                            Upgrade
                        </Button>
                    </Form>
                </Card>
            </Col>
            <Col span={24}>
                <TableTransfer
                    className={darkTheme ? "alerts_table" : "alerts_table_light"}
                    rowKey={(record) => record.id}
                    dataSource={(boxType>-1) ? currentData.filter(item => item.boxType == boxType) : []}
                    titles={[boxType==-1 && <Tag color="warning">Choose Package To See Sites</Tag>]}
                    targetKeys={targetKeys}
                    showSearch
                    showSelectAll={false}
                    disabled={isUpgrading}
                    onChange={onChange}
                    filterOption={filterOption}
                    leftColumns={columns}
                    rightColumns={columns}
                />
            </Col>
        </Row>
    </Skeleton>
    )
}

interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: DataType[];
    leftColumns: TableColumnsType<DataType>;
    rightColumns: TableColumnsType<DataType>;
    disabled: boolean;
}

const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, disabled, rightColumns, ...restProps } = props;
    return (
      <Transfer disabled={disabled} style={{ width: '100%' }} {...restProps}>
        {({
          direction,
          filteredItems,
          onItemSelect,
          onItemSelectAll,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection: TableRowSelection<TransferItem> = {
            getCheckboxProps: () => ({ disabled: listDisabled }),
            onChange(selectedRowKeys) {
              onItemSelectAll(selectedRowKeys, 'replace');
            },
            selectedRowKeys: listSelectedKeys,
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          };
  
          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : undefined }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) {
                    return;
                  }
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
            />
          );
        }}
      </Transfer>
    );
};