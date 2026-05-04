/* eslint-disable consistent-return */
import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Optional, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { Note, NoteUser } from '@app/entities';
import { UserManagementFacade } from '@app/store/user-management';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import * as Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Subscription } from 'rxjs';
import { BaseFormControl } from '../../base';

interface ConfigMention {
  id: string;
  userId: number;
  name: string;
};
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true,
    },
  ],
})
export class TextEditorComponent extends BaseFormControl<string> implements OnInit, AfterViewInit {

  @Input() submitted = false;
  @Input() required = false;
  @Input() isFlagged = false;
  @Input() maxLength = 1000;
  @Input() disableControl = false;
  @Input() note = new Note();

  @Output() change = new EventEmitter<Note>();

  readonly options = [
    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
    { model: 'heading1', view: 'h1', title: 'Heading', class: 'ck-heading_heading1' },
    { model: 'heading2', view: 'h2', title: 'Sub Heading', class: 'ck-heading_heading2' },
  ];

  public editor: ClassicEditor = Editor;
  activeUsers: ConfigMention[] = [];

  config = {
    mention: {
      feeds: [
        {
          marker: '@',
          feed: [],
          minimumCharacters: 0,
        },
      ],
    },
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link'],
    heading: {
      options: this.options,
    },
    link: {
      defaultProtocol: 'http://',
      addTargetToExternalLinks: false,
    },
    placeholder: 'Type your message here...',
  };

  subscription = new Subscription();

  @ViewChildren(NgModel) override ngModels: QueryList<NgModel>;

  constructor(@Optional() public override ngForm: NgForm, private userManagement: UserManagementFacade) {
    super(ngForm);
  }

  ngOnInit(): void {
    this.note.isFlagged = this.isFlagged ?? false;

    // Get the active all users
    this.subscription.add(
      this.userManagement.activeUsers$.subscribe((users) => {
        this.activeUsers = users.filter(user =>!user.isDisabled).map((u) => {

          return {
            id: `@${u.fullName}`,
            userId: u.id,
            name: u.fullName,
          };
        });
        this.config.mention.feeds[0].feed = this.activeUsers;
      })
    );
  }

  ngAfterViewInit() {
    this.addControls();
  }

  onEditorReady(editor) {
    this.mentionCustomization(editor);
  }

  contentChanged() {
    this.note.content = this.value;
    const users = this.extractUserIds(this.note.content);

    this.note = {...this.note, users};
    this.change.emit(this.note);
  }

  toggleFlag() {
    this.note.isFlagged = !this.note.isFlagged;
    this.change.emit(this.note);
  }

  private extractUserIds(content: string): NoteUser[] {
    const users: NoteUser[] = [];

    // Regular expression to match data-user-id attribute
    const regex = /data-user-id="(\d+)"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const userId = +match[1];
      users.push({
        id: userId,
        name: this.activeUsers.find(u => u.userId == userId).name
      });
    }
    return users;
  };

  private mentionCustomization(editor) {
    editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'a',
        key: 'data-mention',
        classes: 'mention',
        attributes: {
          href: true,
          'data-user-id': true,
        },
      },
      model: {
        key: 'mention',
        value: (viewItem) => {
          const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
            link: viewItem.getAttribute('href'),
            userId: viewItem.getAttribute('data-user-id'),
          });

          return mentionAttribute;
        },
      },
      converterPriority: 'high',
    });

    editor.conversion.for('downcast').attributeToElement({
      model: 'mention',
      view: (modelAttributeValue, { writer }) => {

        if (!modelAttributeValue) return null;

        return writer.createAttributeElement(
          'a',
          {
            class: 'mention',
            'data-mention': modelAttributeValue.id,
            'data-user-id': modelAttributeValue.userId,
          },
          {
            priority: 20,
            id: modelAttributeValue.uid,
          }
        );
      },
      converterPriority: 'high',
      
    });
  };

}
