create database Go4Success;

create table ROOM (
	NAME char(255) not null,
	SITE char(255) not null,
	primary key (SITE, NAME));

create table COURSE (
	COURSE_CODE char(9) not null,
	USER INT not null,
	FOREIGN KEY (USER) REFERENCES USER(ID),
	primary key (COURSE_CODE));

CREATE TABLE LANGUAGE (
    ID INT AUTO_INCREMENT,
    NAME CHAR(50) NOT NULL,
	CODE CHAR(6) NOT NULL,
    PRIMARY KEY (ID));

-- =================USERS SECTION=======================

create table USER (
	ID INT AUTO_INCREMENT,
	E_MAIL char(255) not null,
	NAME char(64) not null,
	FIRST_NAME char(64) not null,
	PWD char(64) not null,
	primary key (ID));

create table TEACHER (
	ID INT AUTO_INCREMENT,
    USER_ID INT not null,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID),
	primary key (ID));

create table TUTOR (
	ID INT AUTO_INCREMENT,
    TEACHER_ID INT,
    FOREIGN KEY (TEACHER_ID) REFERENCES TEACHER(ID),
	primary key (ID));

create table PROFESSOR (
	ID INT AUTO_INCREMENT,
    TEACHER_ID INT,
    FOREIGN KEY (TEACHER_ID) REFERENCES TEACHER(ID),
	primary key (ID));

create table ADMIN (
	ID INT AUTO_INCREMENT,
    USER_ID INT not null,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID),
	primary key (ID));

create table STUDENT (
	ID INT AUTO_INCREMENT,
	NOMA INT not null,
    USER_ID INT not null,
    FOREIGN KEY (USER_ID) REFERENCES USER(ID),
	primary key (ID));

-- =========================================

create table ACTIVITY (
	ID INT AUTO_INCREMENT,
	TYPE char(255) not null,
	NAME char(255) not null,
	DATE_START date not null,
	DATE_END date not null,
	IN_SITE char(255) not null,
	IN_NAME char(255) not null,
	COURSE_CODE char(1),
	LANGUAGE_ID INT NOT NULL,
    foreign key (IN_SITE, IN_NAME) REFERENCES ROOM(SITE, NAME),
    FOREIGN KEY (COURSE_CODE) REFERENCES COURSE(COURSE_CODE),
	FOREIGN KEY (LANGUAGE_ID) REFERENCES LANGUAGE(ID),
	primary key (ID));

create table ANNOUNCEMENT (
	ID INT AUTO_INCREMENT,
	TITLE char(255) not null,
	DESCRIPTION TEXT not null,
	PUB_DATE date not null,
	COURSE_CODE char(1),
	CREATOR_ID INT,
    FOREIGN KEY (COURSE_CODE) REFERENCES COURSE(COURSE_CODE),
    FOREIGN KEY (CREATOR_ID) REFERENCES TEACHER(ID),
	primary key (ID));

create table ATTENDS (
	ACTIVITY_ID INT,
	STUDENT_ID INT,
    FOREIGN KEY (ACTIVITY_ID) REFERENCES ACTIVITY(ID),
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(ID),
	primary key (STUDENT_ID, ACTIVITY_ID));


create table GIVES (
	ACTIVITY_ID INT not null,
	TEACHER_ID INT not null,
    FOREIGN KEY (ACTIVITY_ID) REFERENCES ACTIVITY(ID),
    FOREIGN KEY (TEACHER_ID) REFERENCES TEACHER(ID),
	primary key (TEACHER_ID, ACTIVITY_ID));

create table MESSAGE (
	ID INT AUTO_INCREMENT,
	CONTENT TEXT not null,
	DATE date not null,
	TO_ID INT not null,
	FROM_ID INT not null,
    FOREIGN KEY (TO_ID) REFERENCES USER(ID),
    FOREIGN KEY (FROM_ID) REFERENCES USER(ID),
	primary key (ID));

create table REGISTERED (
	COURSE_CODE char(9) not null,
	STUDENT_ID INT not null,
    FOREIGN KEY (COURSE_CODE) REFERENCES COURSE(COURSE_CODE),
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(ID),
	primary key (STUDENT_ID, COURSE_CODE));

create table SEES (
	ANNOUNCEMENT_ID INT not null,
	USER_ID INT not null,
    FOREIGN KEY (ANNOUNCEMENT_ID) REFERENCES ANNOUNCEMENT(ID),
    FOREIGN KEY (USER_ID) REFERENCES USER(ID),
	primary key (ANNOUNCEMENT_ID, USER_ID));

-- =========================================

CREATE TABLE FEEDBACK(
	ID INT AUTO_INCREMENT,
	USER INT NOT NULL,
	ACTIVITY_ID INT NOT NULL,
	POSITIVE_POINT BOOLEAN NOT NULL,
	NEGATIVE_POINT BOOLEAN NOT NULL,
	SUGGESTION BOOLEAN NOT NULL,
	ADDITIONAL_COMMENT BOOLEAN NOT NULL,
	DATE_START DATE NOT NULL,
	DATE_END DATE NOT NULL,
	FOREIGN KEY (USER) REFERENCES USER(ID),
	FOREIGN KEY (ACTIVITY_ID) REFERENCES ACTIVITY(ID),
	PRIMARY KEY (ID)
);

CREATE TABLE FEEDBACK_ADDITIONAL_QUESTIONS (
    ID INT AUTO_INCREMENT,
    FEEDBACK_ID INT NOT NULL,
    QUESTION TEXT NOT NULL,
    FOREIGN KEY (FEEDBACK_ID) REFERENCES FEEDBACK(ID),
    PRIMARY KEY (ID)
);

CREATE TABLE FEEDBACK_STUDENT(
	ID INT AUTO_INCREMENT,
	STUDENT_ID INT NOT NULL,
	FEEDBACK_ID INT NOT NULL,
	EVALUATION INT,
	POSITIVE_POINT TEXT,
	NEGATIVE_POINT TEXT,
	SUGGESTION TEXT,
	ADDITIONAL_COMMENT TEXT,
	DATE_SUBMITTED DATE,
	FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(ID),
	FOREIGN KEY (FEEDBACK_ID) REFERENCES FEEDBACK(ID),
	PRIMARY KEY (ID)
);


CREATE TABLE FEEDBACK_STUDENT_ADDITIONAL_QUESTIONS (
    ID INT AUTO_INCREMENT,
    STUDENT_ID INT NOT NULL,
    FEEDBACK_ID INT NOT NULL,
    QUESTION_ID INT NOT NULL,
    ANSWER TEXT,
    FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(ID),
    FOREIGN KEY (FEEDBACK_ID) REFERENCES FEEDBACK(ID),
    FOREIGN KEY (QUESTION_ID) REFERENCES FEEDBACK_ADDITIONAL_QUESTIONS(ID),
    PRIMARY KEY (ID)
);

-- =========================================

create table QUESTIONNAIRE (
	ID INT AUTO_INCREMENT,
	COURSE_ID INT NOT NULL,
	TITLE VARCHAR(255) NOT NULL,
	DESCRIPTION TEXT,
	POINTS_TOTAL INT NOT NULL,
	DATE_START DATE NOT NULL,
	DATE_END DATE NOT NULL
	LANGUAGE_ID INT NOT NULL,
	FOREIGN KEY (COURSE_ID) REFERENCES COURSE(COURSE_CODE) ON DELETE CASCADE,
	FOREIGN KEY (LANGUAGE_ID) REFERENCES LANGUAGE(ID) ON DELETE CASCADE);

create table QUESTION(
	ID INT AUTO_INCREMENT,
	QUESTIONNAIRE_ID INT NOT NULL,
	QUESTION_TEXT TEXT NOT NULL,
	QUESTION_TYPE ENUM('open', 'multiple_choice') NOT NULL,
	POINTS INT NOT NULL,
	FOREIGN KEY (QUESTIONNAIRE_ID) REFERENCES QUESTIONNAIRE(ID) ON DELETE CASCADE);

create table OPEN_ANSWER(
	ID INT AUTO_INCREMENT,
	QUESTION_ID INT NOT NULL,
	STUDENT_ID INT NOT NULL,
	ANSWER_TEXT TEXT,
	IS_CORRECT BOOLEAN,
	FOREIGN KEY (QUESTION_ID) REFERENCES QUESTION(ID) ON DELETE CASCADE,
	FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(ID) ON DELETE CASCADE);

create table CHOICE_ANSWER(
	ID INT AUTO_INCREMENT,
	QUESTION_ID INT NOT NULL,
	STUDENT_ID INT NOT NULL,
	FOREIGN KEY (QUESTION_ID) REFERENCES QUESTION(ID) ON DELETE CASCADE,
	FOREIGN KEY (STUDENT_ID) REFERENCES STUDENT(ID) ON DELETE CASCADE);

create table CHOICE_ANSWER_INSTANCE(
	ID INT AUTO_INCREMENT,
	CHOICE_ANSWER_ID INT NOT NULL,
	CHOICE_TEXT TEXT NOT NULL,
	IS_CORRECT BOOLEAN,
	FOREIGN KEY (CHOICE_ANSWER_ID) REFERENCES CHOICE_ANSWER(ID) ON DELETE CASCADE);


CREATE TABLE OPEN_QUESTION (
    ID INT AUTO_INCREMENT,
    QUESTION_ID INT NOT NULL,
    QUESTION_TEXT TEXT NOT NULL,
    FOREIGN KEY (QUESTION_ID) REFERENCES QUESTION(ID) ON DELETE CASCADE);

CREATE TABLE CLOSED_QUESTION (
    ID INT AUTO_INCREMENT,
    QUESTION_ID INT NOT NULL,
    OPTIONS TEXT NOT NULL,
    CHECKED BOOLEAN,
    FOREIGN KEY (QUESTION_ID) REFERENCES QUESTION(ID) ON DELETE CASCADE);
