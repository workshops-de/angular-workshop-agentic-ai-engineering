### Dependency Injection

**AVOID**
- Constructor Injection

```ts
<!-- Example -->
  constructor(
    private route: ActivatedRoute,
    private bookApi: BookApiClient,
    private toast: ToastService
  ) {}
```

**Prefer**
- `inject`

```ts
<!-- Example -->
private route = inject(ActivatedRoute),
```