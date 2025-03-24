import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Preview,
  Section,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface ContactProps {
  name: string;
  email: string;
  message: string;
}

const ContactFormEmail = ({ name, email, message }: ContactProps) => (
  <Html>
    <Head />
    <Preview>New Contact Form Submission</Preview>
    <Body style={styles.main}>
      <Container style={styles.container}>
        <Text style={styles.title}>New Contact Form Submission</Text>
        <Section style={styles.detailsContainer}>
          <Text style={styles.details}>
            <strong>Name:</strong> {name || "Not provided"}
          </Text>
          <Text style={styles.details}>
            <strong>Email:</strong> {email || "Not provided"}
          </Text>
          <Text style={styles.details}>
            <strong>Message:</strong>
          </Text>
          <Text style={styles.message}>
            {message || "No message provided."}
          </Text>
        </Section>
        <Hr style={styles.hr} />
        <Text style={styles.footer}>
          Please respond to the user at the provided email address. This message
          was submitted via the contact form.
        </Text>
      </Container>
    </Body>
  </Html>
);

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  main: {
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  container: {
    margin: "0 auto",
    padding: "20px",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1261AD",
    textAlign: "center",
    marginBottom: "16px",
  },
  detailsContainer: {
    backgroundColor: "#f9f9f9",
    padding: "16px",
    borderRadius: "8px",
  },
  details: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#555555",
    marginBottom: "8px",
  },
  message: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#333333",
    marginTop: "8px",
    whiteSpace: "pre-wrap",
  },
  hr: {
    borderColor: "#eeeeee",
    margin: "16px 0",
  },
  footer: {
    fontSize: "12px",
    lineHeight: "18px",
    color: "#888888",
    textAlign: "center",
  },
};

export default ContactFormEmail;
