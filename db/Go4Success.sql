-- ***************************
-- * Standard SQL generation *
-- ***************************


-- Database Section
-- ________________

create database DB_relational;


-- TableSpace Section
-- __________________

-- Table Section
-- _____________

create table ACTIVITY (
	ID INT AUTO_INCREMENT,
	TYPE char(255) not null,
	NAME char(255) not null,
	DATE_START date not null,
	DATE_END date not null,
	IN_SITE char(255) not null,
	IN_NAME char(255) not null,
	COURSE_CODE char(1),
	primary key (ID));

create table ADMIN (
	ID INT AUTO_INCREMENT,
	primary key (ID));

create table ANNOUNCEMENT (
	ID INT AUTO_INCREMENT,
	TITLE char(255) not null,
	DESCRIPTION char(2048) not null,
	PUB_DATE date not null,
	COURSE_CODE char(1),
	CREATOR_ID INT,
	primary key (ID));

create table ATTENDS (
	ACTIVITY_ID INT,
	STUDENT_ID INT,
	primary key (STUDENT_ID, ACTIVITY_ID));

create table COURSE (
	COURSE_CODE char(1) not null,
	primary key (COURSE_CODE));

create table GIVES (
	ACTIVITY_ID INT not null,
	TEACHER_ID INT not null,
	primary key (TEACHER_ID, ACTIVITY_ID));

create table MESSAGE (
	ID INT AUTO_INCREMENT,
	CONTENT char(520) not null,
	DATE date not null,
	TO_ID INT not null,
	FROM_ID INT not null,
	primary key (ID));

create table PROFESSOR (
	ID INT AUTO_INCREMENT,
	primary key (ID));

create table REGISTERED (
	COURSE_CODE char(1) not null,
	ID INT not null,
	primary key (ID, COURSE_CODE));

create table ROOM (
	NAME char(255) not null,
	SITE char(255) not null,
	primary key (SITE, NAME));

create table SEES (
	ANNOUNCEMENT_ID INT not null,
	USER_ID INT not null,
	primary key (ANNOUNCEMENT_ID, USER_ID));

create table STUDENT (
	ID INT AUTO_INCREMENT,
	STUDENT_NUMBER char(1),
	NOMA char(1) not null,
	primary key (ID));

create table TEACHER (
	ID INT AUTO_INCREMENT,
	TUTOR INT,
	PROFESSOR INT,
	primary key (ID));

create table TUTOR (
	ID INT AUTO_INCREMENT,
	primary key (ID));

create table USER (
	ID INT AUTO_INCREMENT,
	E_MAIL char(320) not null,
	NAME char(64) not null,
	FIRST_NAME char(64) not null,
	PWD char(64) not null,
	TEACHER INT,
	STUDENT INT,
	ADMIN INT,
	primary key (ID));


-- Constraints Section
-- ___________________

alter table ACTIVITY add constraint FKIN
	foreign key (IN_SITE, IN_NAME)
	references ROOM;

alter table ACTIVITY add constraint FKFOR
	foreign key (COURSE_CODE)
	references COURSE;

alter table ADMIN add constraint FKUSE_ADM
	foreign key (ID)
	references USER;

alter table ANNOUNCEMENT add constraint FKIS_RELATED_TO
	foreign key (COURSE_CODE)
	references COURSE;

alter table ANNOUNCEMENT add constraint FKCREATES
	foreign key (CREATOR_ID)
	references TEACHER;

alter table ATTENDS add constraint FKATT_STU
	foreign key (STUDENT_ID)
	references STUDENT;

alter table ATTENDS add constraint FKATT_ACT
	foreign key (ACTIVITY_ID)
	references ACTIVITY;

alter table GIVES add constraint FKGIV_TEA
	foreign key (TEACHER_ID)
	references TEACHER;

alter table GIVES add constraint FKGIV_ACT
	foreign key (ACTIVITY_ID)
	references ACTIVITY;

alter table ACTIVITY add constraint 
	check(exist(select * from GIVES
	            where GIVES.ACTIVITY_ID = ID));

alter table MESSAGE add constraint FKTO
	foreign key (TO_ID)
	references USER;

alter table MESSAGE add constraint FKFROM
	foreign key (FROM_ID)
	references USER;

alter table PROFESSOR add constraint FKTEA_PRO
	foreign key (ID)
	references TEACHER;

alter table REGISTERED add constraint FKREG_STU
	foreign key (ID)
	references STUDENT;

alter table REGISTERED add constraint FKREG_COU
	foreign key (COURSE_CODE)
	references COURSE;

alter table SEES add constraint FKSEE_USE
	foreign key (USER_ID)
	references USER;

alter table SEES add constraint FKSEE_ANN
	foreign key (ANNOUNCEMENT_ID)
	references ANNOUNCEMENT;

alter table STUDENT add constraint FKUSE_STU
	foreign key (ID)
	references USER;

alter table TEACHER add constraint EXTONE_TEACHER
	check((PROFESSOR is not null and TUTOR is null)
	      or (PROFESSOR is null and TUTOR is not null));

alter table TEACHER add constraint FKUSE_TEA
	foreign key (ID)
	references USER;

alter table TUTOR add constraint FKTEA_TUT
	foreign key (ID)
	references TEACHER;

alter table USER add constraint LSTONE_USER
	check(ADMIN is not null or STUDENT is not null or TEACHER is not null);


-- Index Section
-- _____________

create unique index ID_ACTIVITY
	on ACTIVITY(ID);

create index FKIN
	on ACTIVITY (IN_SITE, IN_NAME);

create index FKFOR
	on ACTIVITY (COURSE_CODE);

create unique index FKUSE_ADM
	on ADMIN(ID);

create unique index ID_ANNOUNCEMENT
	on ANNOUNCEMENT(ID);

create index FKIS_RELATED_TO
	on ANNOUNCEMENT (COURSE_CODE);

create index FKCREATES
	on ANNOUNCEMENT (CREATOR_ID);

create unique index ID_ATTENDS
	on ATTENDS(STUDENT_ID, ACTIVITY_ID);

create index FKATT_ACT
	on ATTENDS (ACTIVITY_ID);

create unique index ID_COURSE
	on COURSE(COURSE_CODE);

create unique index ID_GIVES
	on GIVES(TEACHER_ID, ACTIVITY_ID);

create index FKGIV_ACT
	on GIVES (ACTIVITY_ID);

create unique index ID_MESSAGE
	on MESSAGE(ID);

create index FKTO
	on MESSAGE (TO_ID);

create index FKFROM
	on MESSAGE (FROM_ID);

create unique index FKTEA_PRO
	on PROFESSOR(ID);

create unique index ID_REGISTERED
	on REGISTERED(ID, COURSE_CODE);

create index FKREG_COU
	on REGISTERED (COURSE_CODE);

create unique index ID_ROOM
	on ROOM(SITE, NAME);

create unique index ID_SEES
	on SEES(ANNOUNCEMENT_ID, USER_ID);

create index FKSEE_USE
	on SEES (USER_ID);

create unique index FKUSE_STU
	on STUDENT(ID);

create unique index FKUSE_TEA
	on TEACHER(ID);

create unique index FKTEA_TUT
	on TUTOR(ID);

create unique index ID_USER
	on USER(ID);

