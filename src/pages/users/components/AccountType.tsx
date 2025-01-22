import { Tag } from "antd";

const AccountType = ( {user}: {user: any} ) => {
    var type = "Admin";
    var color = "blue";

    if ( user?.filter ) {
        type = "Customer";
        color = "gold";
    } else if ( user?.permission ) {
        type = "User";
        color = "purple";
    }

    return (
    <Tag color={color}>
        {type}
    </Tag>)
}
export default AccountType;