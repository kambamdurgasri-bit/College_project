#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/b4a3c6fea33ea67d7e78fe232d0f323ff37b63f3c29960fbc3d9831b54733bbd/contract';
import endContract from '../../snapshots/b4a3c6fea33ea67d7e78fe232d0f323ff37b63f3c29960fbc3d9831b54733bbd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'attempt_answers',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('question_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quiz_attempt_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('selected_answer', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'attempt_answers_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'learning_spaces',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'learning_spaces_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'questions',
        columns: [
          col('correct_answer', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('question_id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('question_text', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quiz_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['question_id'], { name: 'questions_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'quiz_attempts',
        columns: [
          col('attempted_at', 'timestamp', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1' },
          }),
          col('quiz_attempt_id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quiz_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('score', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['quiz_attempt_id'], { name: 'quiz_attempts_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'quizzes',
        columns: [
          col('difficulty', 'character varying(20)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('learning_space_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quiz_type', 'character varying(20)', {
            notNull: true,
            default: lit('TOPIC'),
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('topic', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'quizzes_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'recommendations',
        columns: [
          col('created_at', 'timestamp', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('recommendation', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('recommendation_type', 'character varying(50)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 50 } },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'recommendations_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'timetables',
        columns: [
          col('day', 'character varying(20)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
          col('end_time', 'time', { notNull: true, codecRef: { codecId: 'pg/time-temporal@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('start_time', 'time', { notNull: true, codecRef: { codecId: 'pg/time-temporal@1' } }),
          col('subject', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'timetables_pkey' })],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('email', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'character varying(100)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 100 } },
          }),
          col('password_hash', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('phone_number', 'character varying(20)', {
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 20 } },
          }),
        ],
        constraints: [primaryKey(['id'], { name: 'users_pkey' })],
      }),
      this.addUnique({
        schema: 'public',
        table: 'attempt_answers',
        constraint: 'uq_attempt_answers_attempt_question',
        columns: ['quiz_attempt_id', 'question_id'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attempt_answers',
        index: 'idx_attempt_answers_question_id',
        columns: ['question_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attempt_answers',
        index: 'idx_attempt_answers_quiz_attempt_id',
        columns: ['quiz_attempt_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'learning_spaces',
        index: 'idx_learning_spaces_user_id',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'questions',
        index: 'idx_questions_quiz_id',
        columns: ['quiz_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quiz_attempts',
        index: 'idx_quiz_attempts_quiz_id',
        columns: ['quiz_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quiz_attempts',
        index: 'idx_quiz_attempts_user_id',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'quizzes',
        index: 'idx_quizzes_learning_space_id',
        columns: ['learning_space_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'recommendations',
        index: 'idx_recommendations_user_id',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'timetables',
        index: 'idx_timetables_user_id',
        columns: ['user_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'attempt_answers',
        foreignKey: {
          name: 'attempt_answers_question_id_fkey',
          columns: ['question_id'],
          references: { schema: 'public', table: 'questions', columns: ['question_id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'attempt_answers',
        foreignKey: {
          name: 'attempt_answers_quiz_attempt_id_fkey',
          columns: ['quiz_attempt_id'],
          references: { schema: 'public', table: 'quiz_attempts', columns: ['quiz_attempt_id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'learning_spaces',
        foreignKey: {
          name: 'learning_spaces_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'questions',
        foreignKey: {
          name: 'questions_quiz_id_fkey',
          columns: ['quiz_id'],
          references: { schema: 'public', table: 'quizzes', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quiz_attempts',
        foreignKey: {
          name: 'quiz_attempts_quiz_id_fkey',
          columns: ['quiz_id'],
          references: { schema: 'public', table: 'quizzes', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quiz_attempts',
        foreignKey: {
          name: 'quiz_attempts_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'quizzes',
        foreignKey: {
          name: 'quizzes_learning_space_id_fkey',
          columns: ['learning_space_id'],
          references: { schema: 'public', table: 'learning_spaces', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'recommendations',
        foreignKey: {
          name: 'recommendations_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'timetables',
        foreignKey: {
          name: 'timetables_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
