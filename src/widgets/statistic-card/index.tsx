import { ArrowUpOutlined } from "@ant-design/icons"
import { Card, Statistic, Typography } from "antd"
import styles from './index.module.css'
import { useContext } from "react";
import { ThemeContext } from "../../theme";

type Props = {
    title: string;
    value: number|string;
    icon: React.ReactNode;
}

export const StatisticCard = ({ icon, title, value}: Props) => {
    const { appTheme } = useContext(ThemeContext);
    const darkTheme = appTheme === "dark";

    return (<Card
        bordered={false}
        className={`${darkTheme ? styles.darkBg : styles.lightBg}`}
        bodyStyle={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}
    >
        <div className={styles.titleContainer}>
            {icon}
            <Typography.Title className={styles.title}>{title}</Typography.Title>
        </div>
        <Typography.Title className={styles.value}>{value}</Typography.Title>
      </Card>)
}