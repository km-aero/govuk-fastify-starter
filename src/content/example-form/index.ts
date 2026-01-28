export const contactFormContent = {
  title: 'Contact us',
  fields: {
    fullName: {
      label: 'Full name',
      error: {
        required: 'Enter your full name',
      },
    },
    email: {
      label: 'Email address',
      hint: 'We will use this to contact you',
      error: {
        invalid: 'Enter an email address in the correct format',
      },
    },
    subject: {
      label: 'Subject',
      options: {
        default: 'Choose option',
        help: 'Help',
        feedback: 'Feedback',
      },
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
};
