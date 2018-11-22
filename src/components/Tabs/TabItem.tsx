import {
  Component,
  Prop,
  Inject,
} from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Api } from '@/api';
import { componentName } from '@/util';
import { TabItemContainer } from './TabItemContainer';
import { Uid } from '@/mixins';

interface Props {
  label?: string | null;
  name?: string | null;
  disabled?: boolean;
  uid?: string; // Uid mixin
}

@Component({ name: componentName('TabItem') })
@Api.Component('Tab Item')
@Api.defaultSlot('Content to be displayed in the tab body when this item is active.')
export class TabItem extends mixins(Uid) {
  @Api.Prop('tab item label', prop => prop.type(String))
  @Prop({ type: String, default: null, required: false })
  public label!: string | null;

  @Api.Prop('name, used to determine whether item is active', prop => prop.type(String))
  @Prop({ type: String, default: null, required: false })
  public name!: string | null;

  @Api.Prop('whether item is disabled', prop => prop.type(Boolean))
  @Prop({ type: Boolean, default: false, required: false })
  public disabled!: boolean;

  @Inject('tabItemContainer')
  public tabItemContainer!: TabItemContainer | null;

  public $tsxProps!: Readonly<{}> & Readonly<Props>;

  public mounted() {
    const { tabItemContainer } = this;
    if (tabItemContainer != null) {
      tabItemContainer.addTabItem(this);
    }
  }

  public destroyed() {
    const { tabItemContainer } = this;
    if (tabItemContainer != null) {
      tabItemContainer.removeTabItem(this);
    }
  }

  public get active(): boolean {
    const { tabItemContainer } = this;
    if (tabItemContainer != null) {
      const { activeName } = tabItemContainer;
      return activeName === this.name;
    }
    return false;
  }

  public render() {
    const expanded = this.active ? 'true' : 'false';
    return (
      <div
        id={this.uid}
        role='tabpanel'
        class='fd-tabs__panel'
        aria-expanded={expanded}
      >
        {this.$slots.default}
      </div>
    );
  }
}
