import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-message',

  templateUrl: './message.component.html',

  styleUrls: ['./message.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnChanges, DoCheck
{
  @Input()
  public message = '';

  @Input()
  public showUpperBar = false;

  @Input()
  public showLowerBar = true;

  constructor()
  {
    // empty
  }

  public ngOnChanges(changes: SimpleChanges): void
  {
    let prop: string;
    for (prop in changes)
    {
      if (prop.toLowerCase() === 'message')
      {
        if (changes[prop].currentValue !== undefined)
        {
          // placeholder to perform any other post-assign processing on the message before display
          this.message = changes[prop].currentValue;
        }
      }
    }
  }

  public ngDoCheck(): void
  {
    console.log('   - Summary Do Check: ', this.message);
  }
}
