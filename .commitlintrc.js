/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ['gitmoji'],
  rules: {
    'header-max-length': [0, 'always', 100],
    'scope-case': [0, 'always', 'pascal-case'],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: 'コミットする変更タイプを選択:',
      scope: '変更内容のスコープ(ex:コンポーネントやファイル名)(optional):',
      customScope: '変更内容のスコープ(ex:コンポーネントやファイル名):',
      subject: '変更内容を要約した本質的説明:\n',
      body: '変更内容の詳細（"|"で改行）(optional):\n',
      breaking: '破壊的変更についての記述(optional):\n',
      footerPrefixesSelect: 'Issueのタイプを選択または記述 (optional):',
      customFooterPrefix: 'Input ISSUES prefix:',
      footer: '関連issueを追記 (ex:"closed #123")(optional):\n',
      confirmCommit: 'このコミット内容でよろしいですか?',
    },
    types: [
      { value: 'feat', name: 'feat: 新機能', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix: バグ修正', emoji: ':bug:' },
      { value: 'docs', name: 'docs: ドキュメントのみの変更', emoji: ':memo:' },
      {
        value: 'style',
        name: 'style: フォーマットの変更（コードの動作に影響しないスペース、フォーマット、セミコロンなど）',
        emoji: ':lipstick:',
      },
      {
        value: 'refactor',
        name: 'refactor: リファクタリングのための変更（機能追加やバグ修正を含まない）',
        emoji: ':recycle:',
      },
      {
        value: 'perf',
        name: 'perf: パフォーマンスの改善のための変更',
        emoji: ':zap:',
      },
      {
        value: 'test',
        name: 'test: 不足テストの追加や既存テストの修正',
        emoji: ':white_check_mark:',
      },
      {
        value: 'build',
        name: 'build: ビルドシステムや外部依存に関する変更（ex: gulp, broccoli, npm）',
        emoji: ':package:',
      },
      {
        value: 'ci',
        name: 'ci: CI用の設定やスクリプトに関する変更（ex: Travis, Circle, BrowserStack, SauceLabs)',
        emoji: ':ferris_wheel:',
      },
      {
        value: 'chore',
        name: 'chore: その他の変更（ソースやテストの変更を含まない）',
        emoji: ':hammer:',
      },
      { value: 'revert', name: 'revert: 以前のコミットに復帰', emoji: ':rewind:' },
    ],
    useEmoji: true,
    emojiAlign: 'left',
    typesSearchValue: true,
    useAI: false,
    themeColorCode: '38;5;208', // 38;5;${color_code: 0 ~ 255} https://www.ditig.com/256-colors-cheat-sheet
    scopes: ['front', 'back'],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'スコープを入力',
    emptyScopesAlias: 'skip',
    upperCaseSubject: true,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [{ value: 'closed', name: 'closed: Issueを完了する' }],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: 'closed #',
    defaultScope: '',
    defaultSubject: '',
  },
}
