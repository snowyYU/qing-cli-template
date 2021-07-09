## 2021.06.24
- 增加 text 类型

## 2021.04.22

- 修改 input-number 的赋值规则
- radio 增加 disabled 状态

## 2021.03.25

- input 增加 input 事件

## 2021.03.24

- 添加 clearValidate 方法，清空表单校验
- radio 添加 props 属性，用以确定 options 的 key 和 value
- select 增加 loading 属性
- select 增加 visible-change 事件，下拉框出现/隐藏时触发

## 3.16

- checkbox 增加 disabled 选项

## 3.15

- 增加 visible 参数，用以动态控制表单项的现实和隐藏，传 `false` 会隐藏该项
- 为 checkbox 项添加 props 参数，用以确定 options 的 key 和 value
- 增加 customLabel 属性，customLabel 设置为 true 时，可以使用名称为 `${key}-label` 的插槽

## 3.13

---

- 增加 inputNumber 类型

## 3.12

- 默认情况下所有的 configForm 中的表单项宽度为 100%，可通过配置 style.width 来控制

## 3.10

- 每项增加 ref 参数，用以取到相应的实例

## 3.5

- custom 类型表单增加作用域插槽，将配置绑定到 config 属性

## 3.3

- 新增自定义类型表单控件, `type = "custom"` 时，可以使用插槽，名称为 key 的值
- 新增 switch 类型表单控件
- 新增时间日期选择控件 `type = "dateTimePicker"`

## 3.2

- 新增时间选择器
- 优化了在不传 placeholder 的情况下的默认值显示
- labelName 改成 label 字段
- 修复了表单项错位问题，在 size 为 small 的状态下所有的项高度统一为 `33px`
- select 组件增加了 props 属性，可以动态更改下拉项的键值字段了，eg `{props:{value:'resourceCode',label:'resourceName'}}`
- 增加了 `checkbox` 多选的支持
- 增加了 input 组件 blur 事件触发自定义事件功能 `${key}-blur`
- 为 date-piker 组件增加 value-format 功能，默认 `yyyy-MM-dd`
- 增加了 `select radio` change 事件触发自定义事件功能 `${key}-change`

## 3.12

- 修改 otherRules 判空条件
