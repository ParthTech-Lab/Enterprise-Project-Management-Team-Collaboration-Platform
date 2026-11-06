import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { DataService } from '../../core/services/data.service';
import { ModalService } from '../../core/services/modal.service';
import { NotificationService } from '../../core/services/notification.service';
import { ChatChannel, ChatMessage } from '../../core/models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, AvatarComponent, BadgeComponent],
  template: `
    <div class="chat-viewport">
      <!-- Left Channels / DMs Sidebar -->
      <aside class="chat-channels-sidebar">
        <!-- Sidebar Search & Header -->
        <div class="chat-sb-header">
          <span class="sb-title">Channels & Direct Messages</span>
          <button type="button" class="orbit-btn orbit-btn-ghost orbit-btn-icon" (click)="notifService.info('New Channel', 'Create Channel dialog')">
            <app-icon name="plus" [size]="15"></app-icon>
          </button>
        </div>

        <div class="chat-sb-scroll">
          <!-- Public Channels -->
          <div class="channel-group">
            <span class="group-label">PUBLIC CHANNELS</span>
            <div
              *ngFor="let c of publicChannels()"
              class="channel-item"
              [class.active]="selectedChannelId() === c.id"
              (click)="selectedChannelId.set(c.id)"
            >
              <span class="chan-hash">#</span>
              <span class="chan-name">{{ c.name }}</span>
              <span *ngIf="c.unreadCount > 0" class="unread-pill">{{ c.unreadCount }}</span>
            </div>
          </div>

          <!-- Private Channels -->
          <div class="channel-group">
            <span class="group-label">PRIVATE SECURE CHANNELS</span>
            <div
              *ngFor="let c of privateChannels()"
              class="channel-item"
              [class.active]="selectedChannelId() === c.id"
              (click)="selectedChannelId.set(c.id)"
            >
              <app-icon name="lock" [size]="12" customClass="lock-icon"></app-icon>
              <span class="chan-name">{{ c.name }}</span>
              <span *ngIf="c.unreadCount > 0" class="unread-pill">{{ c.unreadCount }}</span>
            </div>
          </div>

          <!-- Direct Messages -->
          <div class="channel-group">
            <span class="group-label">DIRECT MESSAGES</span>
            <div
              *ngFor="let d of directMessages()"
              class="channel-item dm-item"
              [class.active]="selectedChannelId() === d.id"
              (click)="selectedChannelId.set(d.id)"
            >
              <app-avatar [src]="d.avatar" [name]="d.name" size="xs" [status]="d.status ? 'online' : 'away'"></app-avatar>
              <span class="chan-name">{{ d.name }}</span>
              <span *ngIf="d.unreadCount > 0" class="unread-pill">{{ d.unreadCount }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Chat Stream & Thread -->
      <main class="chat-main-area">
        <!-- Channel Top Bar -->
        <header class="channel-top-bar" *ngIf="currentChannel() as chan">
          <div class="chan-header-info">
            <div class="c-title-row">
              <span class="c-symbol">{{ chan.type === 'direct' ? '@' : '#' }}</span>
              <h2 class="c-heading">{{ chan.name }}</h2>
              <app-badge variant="emerald" size="sm">Active</app-badge>
            </div>
            <p class="c-topic" *ngIf="chan.topic">{{ chan.topic }}</p>
          </div>

          <div class="chan-header-actions">
            <button
              type="button"
              class="orbit-btn orbit-btn-secondary orbit-btn-sm"
              (click)="notifService.info('Pinned Items', 'Viewing 1 pinned architectural announcement')"
            >
              <app-icon name="pin" [size]="13"></app-icon>
              <span>1 Pinned</span>
            </button>
            <button
              type="button"
              class="orbit-btn orbit-btn-outline orbit-btn-sm"
              (click)="notifService.info('Channel Members', '4 enterprise team members connected to this channel')"
            >
              <app-icon name="users" [size]="13"></app-icon>
              <span>{{ chan.memberIds.length }} Members</span>
            </button>
          </div>
        </header>

        <!-- Message History List -->
        <div class="messages-stream-container">
          <!-- Pinned Announcement Banner -->
          <div class="pinned-banner" *ngIf="hasPinnedMessage()">
            <app-icon name="pin" [size]="14" customClass="pin-icon"></app-icon>
            <div class="pin-text">
              <strong>Pinned by Ananya Iyer:</strong>
              <span>Istio cross-region failover drill scheduled for tomorrow 10:00 AM IST.</span>
            </div>
          </div>

          <!-- Message Items -->
          <div
            *ngFor="let msg of activeChannelMessages()"
            class="chat-msg-row"
            [class.pinned]="msg.pinned"
          >
            <app-avatar [src]="msg.senderAvatar" [name]="msg.senderName" size="md"></app-avatar>
            <div class="msg-content-wrapper">
              <div class="msg-meta-line">
                <span class="m-sender">{{ msg.senderName }}</span>
                <span class="m-role-tag" *ngIf="msg.senderRole">{{ msg.senderRole }}</span>
                <span class="m-time">{{ msg.timestamp }}</span>
              </div>
              <div class="msg-body-text">{{ msg.content }}</div>

              <!-- Reactions Row -->
              <div class="msg-reactions-row" *ngIf="msg.reactions && msg.reactions.length > 0">
                <div
                  *ngFor="let r of msg.reactions"
                  class="reaction-pill"
                  (click)="toggleReaction(msg, r.emoji)"
                >
                  <span>{{ r.emoji }}</span>
                  <span class="r-count">{{ r.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div class="typing-indicator" *ngIf="isTyping">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="typing-text">Pooja Sundaram is typing...</span>
          </div>
        </div>

        <!-- Message Composer -->
        <footer class="chat-composer-footer">
          <div class="composer-box">
            <textarea
              class="orbit-textarea composer-input"
              rows="2"
              [placeholder]="'Message #' + (currentChannel()?.name || 'channel') + '...'"
              [(ngModel)]="newMessageText"
              (keydown.enter)="onComposerEnter($event)"
            ></textarea>

            <div class="composer-toolbar">
              <div class="toolbar-left-tools">
                <button type="button" class="tool-btn" (click)="notifService.info('Attachments', 'File attachment dialog')" title="Attach file">
                  <app-icon name="paperclip" [size]="15"></app-icon>
                </button>
                <button type="button" class="tool-btn" (click)="insertCodeSnippet()" title="Insert code snippet">
                  <app-icon name="server" [size]="14"></app-icon>
                </button>
              </div>

              <div class="toolbar-right-send">
                <span class="press-hint">Press ↵ to send</span>
                <button
                  type="button"
                  class="orbit-btn orbit-btn-primary orbit-btn-sm"
                  [disabled]="!newMessageText.trim()"
                  (click)="sendMessage()"
                >
                  <app-icon name="send" [size]="13"></app-icon>
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .chat-viewport {
      display: flex;
      height: 100%;
      overflow: hidden;
      background: var(--bg-canvas);
    }

    /* Channels Sidebar */
    .chat-channels-sidebar {
      width: 280px;
      background: var(--surface-primary);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    @media (max-width: 800px) {
      .chat-channels-sidebar {
        display: none;
      }
    }

    .chat-sb-header {
      height: 56px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }

    .sb-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .chat-sb-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .channel-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .group-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 4px 8px;
    }

    .channel-item {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      transition: all 0.12s ease;
    }

    .channel-item:hover {
      background: var(--surface-secondary);
      color: var(--text-primary);
    }

    .channel-item.active {
      background: var(--surface-tertiary);
      color: var(--text-primary);
      font-weight: 600;
    }

    .chan-hash {
      color: var(--text-muted);
      font-weight: 700;
    }

    .lock-icon {
      color: var(--text-muted);
    }

    .chan-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread-pill {
      font-size: 10px;
      font-weight: 700;
      background: var(--accent-emerald);
      color: #ffffff;
      padding: 1px 6px;
      border-radius: 9999px;
    }

    .dm-item {
      gap: 10px;
    }

    /* Main Area */
    .chat-main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
    }

    .channel-top-bar {
      height: 60px;
      padding: 0 24px;
      background: var(--surface-primary);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-shrink: 0;
    }

    .chan-header-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .c-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .c-symbol {
      color: var(--text-muted);
      font-size: 18px;
      font-weight: 700;
    }

    .c-heading {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .c-topic {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .chan-header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Messages Stream */
    .messages-stream-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pinned-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      background: var(--surface-primary);
      border: 1px solid var(--border-default);
      font-size: 12px;
      color: var(--text-primary);
    }

    .pin-icon {
      color: var(--accent-amber);
      flex-shrink: 0;
    }

    .chat-msg-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 6px 0;
    }

    .msg-content-wrapper {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .msg-meta-line {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .m-sender {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .m-role-tag {
      font-size: 10px;
      color: var(--accent-emerald);
      background: var(--accent-emerald-subtle);
      padding: 1px 5px;
      border-radius: 3px;
    }

    .m-time {
      font-size: 11px;
      color: var(--text-muted);
    }

    .msg-body-text {
      font-size: 13px;
      color: var(--text-primary);
      line-height: 1.55;
    }

    .msg-reactions-row {
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }

    .reaction-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      background: var(--surface-primary);
      border: 1px solid var(--border-default);
      border-radius: 9999px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .reaction-pill:hover {
      background: var(--surface-tertiary);
      border-color: var(--border-strong);
    }

    .r-count {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
      font-style: italic;
      padding: 4px 0;
    }

    .dot {
      width: 4px;
      height: 4px;
      border-radius: 9999px;
      background-color: var(--text-muted);
      animation: pulse 1s infinite alternate;
    }

    /* Composer */
    .chat-composer-footer {
      padding: 16px 24px 20px;
      background: var(--surface-primary);
      border-top: 1px solid var(--border-subtle);
    }

    .composer-box {
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      background: var(--surface-secondary);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: border-color 0.15s ease;
    }

    .composer-box:focus-within {
      border-color: var(--accent-emerald);
    }

    .composer-input {
      background: transparent;
      border: none;
      resize: none;
      padding: 10px 14px;
      font-size: 13px;
      min-height: 52px;
    }
    .composer-input:focus {
      box-shadow: none;
      background: transparent;
    }

    .composer-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background: var(--surface-primary);
      border-top: 1px solid var(--border-subtle);
    }

    .toolbar-left-tools {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .tool-btn {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.12s ease;
    }
    .tool-btn:hover {
      color: var(--text-primary);
    }

    .toolbar-right-send {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .press-hint {
      font-size: 10px;
      color: var(--text-muted);
    }
  `]
})
export class ChatComponent {
  public dataService = inject(DataService);
  public modalService = inject(ModalService);
  public notifService = inject(NotificationService);

  public selectedChannelId = signal<string>('chan-2');
  public newMessageText = '';
  public isTyping = false;

  public publicChannels = computed(() => {
    return this.dataService.chatChannels().filter(c => c.type === 'channel' && !c.isPrivate);
  });

  public privateChannels = computed(() => {
    return this.dataService.chatChannels().filter(c => c.type === 'channel' && c.isPrivate);
  });

  public directMessages = computed(() => {
    return this.dataService.chatChannels().filter(c => c.type === 'direct');
  });

  public currentChannel = computed(() => {
    return this.dataService.chatChannels().find(c => c.id === this.selectedChannelId()) || this.dataService.chatChannels()[0];
  });

  public activeChannelMessages = computed(() => {
    return this.dataService.chatMessages().filter(m => m.channelId === this.selectedChannelId());
  });

  hasPinnedMessage(): boolean {
    return this.activeChannelMessages().some(m => m.pinned);
  }

  onComposerEnter(event: Event): void {
    const kbEvent = event as KeyboardEvent;
    if (!kbEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const text = this.newMessageText.trim();
    if (!text) return;

    this.dataService.sendChatMessage(this.selectedChannelId(), text);
    this.newMessageText = '';

    // Simulate realistic typing reply
    setTimeout(() => {
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
      }, 2500);
    }, 1000);
  }

  insertCodeSnippet(): void {
    this.newMessageText += ' ```typescript\n// Enterprise Event Listener\n``` ';
  }

  toggleReaction(msg: ChatMessage, emoji: string): void {
    if (!msg.reactions) return;
    const r = msg.reactions.find(re => re.emoji === emoji);
    if (r) {
      r.count += 1;
    }
  }
}

