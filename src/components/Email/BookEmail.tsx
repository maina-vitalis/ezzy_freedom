import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "react-email";
import * as React from "react";

interface BookEmailProps {
  recipientName: string;
  bookTitle: string;
  downloadLink: string;
}

export const BookEmail = ({
  recipientName,
  bookTitle,
  downloadLink,
}: BookEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Book is Ready for Download</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={title}>Hello {recipientName},</Text>
        <Text style={paragraph}>
          Thank you for your interest! Your book, <strong>{bookTitle}</strong>,
          is ready for download.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={downloadLink}>
            📥 Download Your Book
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions, feel free to reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default BookEmail;

const main = {
  backgroundColor: "#f4f4f4",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "20px",
};

const container = {
  margin: "20px auto",
  padding: "24px",
  maxWidth: "600px",
  border: `1px solid #eeeeee`,
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
};

const title = {
  fontSize: "22px",
  color: "#31B44C",
  fontWeight: "bold" as const,
  marginBottom: "16px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333333",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#31B44C",
  color: "#ffffff",
  padding: "14px 24px",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  borderRadius: "8px",
  display: "inline-block",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  transition: "background-color 0.3s ease",
};

const hr = {
  borderColor: "#eeeeee",
  margin: "24px 0",
};

const footer = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#888888",
  textAlign: "center" as const,
  marginTop: "16px",
};
