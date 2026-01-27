export const contactFormContent = {
  title: 'Example Page',
  fields: {
    fullName: {
      label: 'Full name',
      error: {
        required: 'Enter your full name',
      },
    },
    email: {
      label: 'Email address',
      error: {
        invalid: 'Enter an email address in the correct format',
      },
    },
    subject: {
      label: 'Subject',
      error: {
        required: 'Select a subject',
      },
    },
    message: {
      label: 'Message',
      error: {
        tooShort: 'Message must be at least 10 characters',
        tooLong: 'Message must be less than 1000 characters',
      },
    },
  },
  submitButton: 'Save and continue',
  confirmation: {
    title: 'Form submitted',
    panelTitle: 'Form submitted',
    panelBody: 'Your reference number<br><strong>HDJ2123F</strong>',
    body: 'We have sent a confirmation email to',
    whatHappensNext: 'What happens next',
    whatHappensNextBody: 'We will contact you within 2 working days.',
    returnLink: 'Return to homepage',
    submitAnotherLink: 'Submit another form',
  },
};
