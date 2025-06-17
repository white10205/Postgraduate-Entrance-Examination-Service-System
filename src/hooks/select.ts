import { IDomEditor, ISelectMenu } from '@wangeditor/editor'

class MySelectMenu implements ISelectMenu {
  // 自带的字段
  title: string
  tag: string
  width: number
  // 自定义的字段
  defineTitle: object
  dataName: string //下拉框选项值对应editor实例中的字段名，通过editor[dataName]=[]设置值
  options: any
  constructor(dataName: any) {
    this.title = 'select'
    this.tag = 'select'
    this.width = 60
    this.dataName = dataName
    this.defineTitle = {
      value: 'title',
      text: '插入字段',
      styleForRenderMenuList: { display: 'none' }
    }
  }
  // 下拉框的选项
    getOptions(editor: any) {
    // 这里我将下拉框选项的值存在了 editor 实例中，以便可以动态改变选项值
    const displayOptions = editor[this.dataName].data || []
    this.options = [this.defineTitle, ...displayOptions]
    return this.options // 这里返回的就是显示在下拉框选项上的值
  }
  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor: IDomEditor): boolean {
    return false
  }
  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor: IDomEditor): string | boolean {
    return 'title' // 为了不改变下拉框的标题，永远返回 'title'
  }
  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {
    return false
  }
  // 点击菜单时触发的函数
  exec(editor: IDomEditor, value: string | boolean) {
    // 向富文本中插入选中项
    editor.insertText(`${value}`)
  }
}

export default MySelectMenu

