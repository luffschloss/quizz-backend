```
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        'users', 
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false /*option create date, updated date*/
        } 
    );

    return user;
}
```

# relationship
## many-to-many relationship
```
- User.belongsToMany(Profile, {through: 'User_Profile'});
- Profile.belongsToMany(User, {through: 'User_Profile'});
```

```
CREATE TABLE cauhoi (
  `macauhoi` int(11) NOT NULL,
  `noidung` varchar(500) NOT NULL,
  `dokho` int(11) NOT NULL,
  `mamonhoc` int(11) NOT NULL,
  `machuong` int(11) NOT NULL,
  `nguoitao` varchar(50) DEFAULT NULL,
  `trangthai` int(11) DEFAULT 1
)
```
```
CREATE TABLE `cautraloi` (
  `macautl` int(11) NOT NULL,
  `macauhoi` int(11) NOT NULL,
  `noidungtl` varchar(500) NOT NULL,
  `ladapan` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```
```
CREATE TABLE `chitietdethi` (
  `made` int(11) NOT NULL,
  `macauhoi` int(11) NOT NULL,
  `thutu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```
```
CREATE TABLE `chitietketqua` (
  `makq` int(11) NOT NULL,
  `macauhoi` int(11) NOT NULL,
  `dapanchon` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```
```
CREATE TABLE `chitietnhom` (
  `manhom` int(11) NOT NULL,
  `manguoidung` varchar(50) NOT NULL DEFAULT '0',
  `hienthi` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```
```
CREATE TABLE `chitietquyen` (
  `manhomquyen` int(11) NOT NULL,
  `chucnang` varchar(50) NOT NULL,
  `hanhdong` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```