show databases;
use email_scheduler;

CREATE TABLE senders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(255),
  smtp_user VARCHAR(255),
  smtp_pass VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emails (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  sender_id BIGINT,
  to_email VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  scheduled_at DATETIME,
  status ENUM('scheduled','sending','sent','failed') DEFAULT 'scheduled',
  sent_at DATETIME NULL,
  last_error TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_email (id),
  INDEX idx_scheduled (scheduled_at),
  FOREIGN KEY (sender_id) REFERENCES senders(id)
);


show tables;

select * from emails;
select * from senders;
select * from users;

alter table users 
add column name varchar(40);

INSERT INTO senders (name, email)
VALUES ('Test Sender', 'sender@test.com');

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL,
  name VARCHAR(255),
  avatar VARCHAR(500),
  provider ENUM('google', 'local') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

UPDATE emails
SET body = REPLACE(
    REPLACE(body, '<h1>', '<h4>'),
    '</h1>', '</h4>'
)
WHERE body LIKE '%<h1>%';

