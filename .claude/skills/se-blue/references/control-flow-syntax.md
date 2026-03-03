# Control Flow Syntax

**AVOID**
- Avoid directives `*ngIf`, `*ngFor`, `*ngSwitch`.

```html
<!-- Example -->
<div *ngIf="state === 'loading'" class="flex justify-center items-center py-20">
```

**Prefer**
- Avoid directives `@if`, `@for`, `@switch`.

```html
<!-- Example -->
 @if(state === 'loading') {
   <div class="flex justify-center items-center py-20">
 }
```
