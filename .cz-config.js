const { readdirSync } = require('fs');

module.exports = {
  // prettier-ignore
  types: [
    { value: 'feat', name: 'feat:     Новая функциональность' },
    { value: 'fix', name: 'fix:      Исправление ошибки' },
    { value: 'docs', name: 'docs:     Изменение документации' },
    {
      value: 'style',
      name:
        'style:    Изменения, которые не влияют на работу кода\n            (пробелы, форматирование, пропущенные точки с запятой и т.д.)',
    },
    {
      value: 'refactor',
      name: 'refactor: Изменение кода, которое не исправляет ошибку и не добавляет новой функциональности',
    },
    {
      value: 'perf',
      name: 'perf:     Изменение кода, улучшающее производительность',
    },
    { value: 'test', name: 'test:     Добавление тестов' },
    {
      value: 'chore',
      name:
        'chore:    Изменения в процессе сборки или вспомогательных инструментах\n            и библиотеках (например генерация документации)',
    },
    { value: 'revert', name: 'revert:   Revert коммита' },
    { value: 'WIP', name: 'WIP:      Рабочий процесс (промежуточные коммиты)' },
    { value: 'build', name: 'build:    Изменения, которые влияют на систему сборки или внешние зависимости\n' +
        '            (например: gulp, broccoli, npm)',
    }
  ],

  scopes: [{ name: 'app' }],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // it needs to match the value for field type. Eg.: 'fix'
  /*scopeOverrides: {
    fix: [

      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },*/

  // override the messages, defaults are as follows
  messages: {
    type: 'Выберите тип изменения, которое вы делаете:',
    scope: '\nУкажите область (scope) этого изменения (необязательно):',
    // used if allowCustomScopes is true
    customScope: 'Укажите область (scope) этого изменения:',
    subject: 'Напишите КРАТКОЕ описание изменения:\n',
    body:
      'Напишите ПОДРОБНОЕ описание изменения (необязательно). Используйте "|" для переноса строки:\n',
    breaking:
      "Перечислите КРИТИЧЕСКИЕ ИЗМЕНЕНИЯ (BREAKING CHANGES) (необязательно):\n",
    footer:
      'Перечислите какие ISSUE закрывает это изменение (необязательно). Например: #31, #34:\n',
    confirmCommit: 'Вы уверены, что хотите сделать данный коммит?',
  },
  // skip any questions you want
  // skipQuestions: ['body'],

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix', 'revert'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  footerPrefix : 'Closes:', // 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
