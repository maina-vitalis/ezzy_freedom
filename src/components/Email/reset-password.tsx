import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from "react-email";
import * as React from "react";
import { CSSProperties } from "react";

interface EzzyResetPasswordEmailProps {
  username?: string;
  resetLink?: string;
}

const ResetPasswordEmail = ({
  username,
  resetLink,
}: EzzyResetPasswordEmailProps) => {
  const previewText = `Reset your Ezzy Freedom & Hope password`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Heading style={styles.title}>
            Reset your <strong>Ezzy Freedom & Hope</strong> password
          </Heading>
          <Section style={styles.detailsContainer}>
            <Text style={styles.details}>Hello {username},</Text>
            <Text style={styles.details}>
              We received a request to reset your password for your Ezzy Freedom
              & Hope account. If you didn’t make this request, you can safely
              ignore this email.
            </Text>
            <Section style={styles.buttonSection}>
              <Button href={resetLink} style={styles.button}>
                Reset Password
              </Button>
            </Section>
            <Text style={styles.details}>
              Or copy and paste this URL into your browser:{" "}
              <Link href={resetLink} style={styles.link}>
                {resetLink}
              </Link>
            </Text>
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            If you didn’t request a password reset, please ignore this email or
            contact support if you have concerns.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

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
    color: "#1261AD", // Using the same blue as ContactFormEmail
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
  buttonSection: {
    margin: "16px 0", // Adjusted from 32px to fit the ContactFormEmail spacing
    textAlign: "center",
  },
  button: {
    backgroundColor: "#008080", // Keeping the teal color from the original
    padding: "12px 20px",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
  },
  link: {
    color: "#008080", // Matching the button color
    textDecoration: "none",
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

export function ezzyResetPasswordEmail(props: EzzyResetPasswordEmailProps) {
  return <ResetPasswordEmail {...props} />;
}

export default ResetPasswordEmail;
