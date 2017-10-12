import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {List, Map} from 'immutable';

@Component({
  selector: 'app-root',
  template: `
    <body>
    <p>Test</p>
    <app-headers
      [states]="states"
      [leftOffset]="leftOffset"></app-headers>
    <div style="width: 500px; border: solid 1px black; overflow: scroll;"
         (scroll)="onScrollX($event)">
      <table>
        <tr style="vertical-align: top">
          <td *ngFor="let state of states ; trackBy: tableTrackBy; let i = index " style="width: 150px; min-width: 150px;">
            <app-state [stateIndex]="i" [state]="state" [items]="items"
                       (moveItemEvent)="onMoveItemEvent($event)"
                       (moveStateEvent)="onMoveStateEvent($event)"
                       (updateItemEvent)="onUpdateItemEvent($event)"></app-state>
          </td>
        </tr>
      </table>
    </div>
    </body>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  items: Map<string, Item> = Map<string, Item>();
  states: List<List<string>> = List<List<string>>();
  leftOffset = '0px';
  constructor() {
    this.items = this.items.withMutations(mutable => {
      mutable.set('A', new Item('A'));
      mutable.set('B', new Item('B'));
      mutable.set('C', new Item('C'));
      mutable.set('D', new Item('D'));
      mutable.set('E', new Item('E'));
      mutable.set('F', new Item('F'));
      mutable.set('G', new Item('G'));
      mutable.set('H', new Item('H'));
      mutable.set('I', new Item('I'));
      mutable.set('J', new Item('J'));
      mutable.set('K', new Item('K'));
      mutable.set('L', new Item('L'));
      mutable.set('M', new Item('M'));
      mutable.set('N', new Item('N'));
      mutable.set('O', new Item('O'));
      mutable.set('P', new Item('P'));
      mutable.set('Q', new Item('Q'));
      mutable.set('R', new Item('R'));
    });
    this.states = this.states.withMutations(mutable => {
      mutable.push(List<string>(['A', 'B', 'C']));
      mutable.push(List<string>(['D', 'E', 'F']));
      mutable.push(List<string>(['G', 'H', 'I']));
      mutable.push(List<string>(['J', 'K', 'L']));
      mutable.push(List<string>(['M', 'N', 'O']));
      mutable.push(List<string>(['P', 'Q', 'R']));
    });
  }



  onMoveItemEvent(event: MoveItemEvent) {
    console.log(`Moving item ${event.item.name} from ${event.from} to ${event.to}`);
    if (event.to >= 0 || event.to < this.states.size) {
      let fromState: List<string> = this.states.get(event.from);
      const index: number = fromState.indexOf(event.item.name);
      fromState = fromState.remove(index);

      let toState: List<string> = this.states.get(event.to);
      toState = toState.insert(0, event.item.name);

      this.states = this.states.set(event.from, fromState);
      this.states = this.states.set(event.to, toState);
    }

  }

  onMoveStateEvent(event: MoveStateEvent) {
    console.log(`Moving state ${event.from} to ${event.to}`);
    if (event.to >= 0 || event.to < this.states.size) {
      const state: List<string> = this.states.get(event.from);
      this.states = this.states.remove(event.from);
      this.states = this.states.insert(event.to, state);
    }
  }

  onUpdateItemEvent(itemEvent: ItemEvent) {
    const item: Item = new Item(itemEvent.item.name, itemEvent.item.value === '+' ? '-' : '+');
    this.items = this.items.withMutations(mutable => {
      mutable.set(item.name, item);
    });
  }

  onScrollX(event: Event) {
    const boardLeftOffset: number = event.target['scrollLeft'] * -1;
    this.leftOffset = boardLeftOffset + 'px';
    console.log('Setting offset to ' + this.leftOffset);
  }

  tableTrackBy(index: number, key: string) {
    // console.log('tracking ' + key);
    return index;
  }


}

@Component({
  selector: 'app-state',
  template: `
    <ul style="list-style: none; width: 100%">
      <li style="background-color: aliceblue">
        {{stateIndex}}
        <a href="left" (click)="onLeft($event)">&lt;</a>
        &nbsp;
        <a href="right" (click)="onRight($event)">&gt;</a>
      </li>
      <li style="background-color: aliceblue">{{lastChanged()}}</li>
      <app-item *ngFor="let itemKey of state ;trackBy: itemTrackBy"
                [stateIndex]="stateIndex"
                [item]="items.get(itemKey)"
                (moveItemEvent)="onMoveItemEvent($event)"
                (updateItemEvent)="onUpdateItemEvent($event)">
      </app-item>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateComponent implements OnInit, OnDestroy {
  @Input()
  stateIndex: number;
  @Input()
  state: List<string> = List<string>();
  @Input()
  items: Map<string, Item> = Map<string, Item>();
  @Output()
  moveItemEvent: EventEmitter<MoveItemEvent> = new EventEmitter<MoveItemEvent>();
  @Output()
  moveStateEvent: EventEmitter<MoveStateEvent> = new EventEmitter<MoveStateEvent>();
  @Output()
  updateItemEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  onLeft(event: MouseEvent) {
    event.preventDefault();
    this.moveStateEvent.emit(new MoveStateEvent(this.stateIndex, this.stateIndex - 1));
  }

  onRight(event: MouseEvent) {
    event.preventDefault();
    this.moveStateEvent.emit(new MoveStateEvent(this.stateIndex, this.stateIndex + 1));
  }

  onMoveItemEvent(moveItemEvent: MoveItemEvent) {
    this.moveItemEvent.emit(moveItemEvent);
  }

  onUpdateItemEvent(itemEvent: ItemEvent) {
    this.updateItemEvent.emit(itemEvent);
  }

  lastChanged() {
    const date: Date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  itemTrackBy(index: number, key: string) {
    // console.log('tracking ' + key);
    return key;
  }

  ngOnInit(): void {
    console.log(`Init ${this.stateIndex}`);
  }

  ngOnDestroy(): void {
    console.log(`Destroy ${this.stateIndex}`);
  }

}

export class MoveStateEvent {
  constructor(readonly from: number, readonly to: number) {
  }
}

@Component({
  selector: 'app-item',
  template: `
    <li>
      <div style="width: 100%; border: solid 1px black">
        <div style="background-color: pink">
          {{item.name}} <span (click)="onUpdate($event)" style="cursor: pointer">{{item.value}}</span>
          <a href="left" (click)="onLeft($event)">&lt;</a>
          &nbsp;
          <a href="right" (click)="onRight($event)">&gt;</a>
        </div>
        <div>{{lastChanged()}}</div>
      </div>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnDestroy, OnInit {
  @Input()
  stateIndex: number;
  @Input()
  item: Item;
  @Output()
  moveItemEvent: EventEmitter<MoveItemEvent> = new EventEmitter<MoveItemEvent>();
  @Output()
  updateItemEvent: EventEmitter<ItemEvent> = new EventEmitter<ItemEvent>();


  constructor() {
  }

  lastChanged() {
    const date: Date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  onLeft(event: MouseEvent) {
    event.preventDefault();
    this.moveItemEvent.emit(new MoveItemEvent(this.item, this.stateIndex, this.stateIndex - 1));
  }

  onRight(event: MouseEvent) {
    event.preventDefault();
    this.moveItemEvent.emit(new MoveItemEvent(this.item, this.stateIndex, this.stateIndex + 1));
  }

  onUpdate(event: MouseEvent) {
    event.preventDefault();
    this.updateItemEvent.emit(new ItemEvent(this.item));
  }


  ngOnInit(): void {
    console.log(`Init ${this.item.name}`);
  }

  ngOnDestroy(): void {
    console.log(`Destroy ${this.item.name}`);
  }
}

export class MoveItemEvent {
  constructor(readonly item: Item, readonly from: number, readonly to: number) {
  }
}

export class Item {
  readonly name: string;
  readonly value: string;


  constructor(name: string, value?: string) {
    this.name = name;
    this.value = !value ? '+' : '-';
  }
}

export class ItemEvent {
  constructor(readonly item: Item) {
  }
}

@Component({
  selector: 'app-headers',
  template: `
    <div style="width: 500px; border: solid 1px black; overflow: hidden" [ngStyle]="{left: leftOffset}">
      <table>
        <tr>
          <td [attr.colspan]="states.size">{{lastChanged()}}</td>
        </tr>
        <tr style="vertical-align: top ; overflow: hidden ;  white-space: nowrap">
          <app-header *ngFor="let state of states ; let i = index "
                      [state]="i">
          </app-header>
        </tr>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadersComponent {
  @Input()
  states: List<Item> = List<Item>();
  private _leftOffset: string;


  @Input()
  set leftOffset(value: string) {
    console.log('Received offset to ' + this._leftOffset);
    this._leftOffset = value;
  }

  get leftOffset(): string {
    return this._leftOffset;
  }

  lastChanged() {
    const date: Date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
}

@Component({
  selector: 'app-header',
  template: `
      <td style="width: 150px; min-width: 150px; text-align: center">
        <div>S-{{state}}</div>
        <div>{{lastChanged()}}</div>
      </td>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input()
  state: number;


  lastChanged() {
    const date: Date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
}


