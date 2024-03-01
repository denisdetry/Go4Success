create database Go4Success;

create table ROOM (
	NAME char(255) not null,
	SITE char(255) not null,
	primary key (SITE, NAME));

create table COURSE (
	COURSE_CODE char(9) not null,
	primary key (COURSE_CODE));

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
    foreign key (IN_SITE, IN_NAME) REFERENCES ROOM(SITE, NAME),
    FOREIGN KEY (COURSE_CODE) REFERENCES COURSE(COURSE_CODE),
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

