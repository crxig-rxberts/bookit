import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colours} from '../../styles/colours';
import {fonts, fontStyles} from '../../styles/fonts';
import Button from '../../components/Button';
import SubtitleContainer from '../../components/containers/SubtitleContainer';
import WhiteContainer from '../../components/containers/WhiteContainer';
import Step1AccountInfo from '../../components/sign-up/Step1AccountInfo';
import Step2AccountInfo from '../../components/sign-up/Step2BusinessProfile';
import Step3AccountInfo from '../../components/sign-up/Step3BusinessSchedule';
import Step4ServiceDetails from '../../components/sign-up/Step4ServiceDetails';
import Step5AccountReview from '../../components/sign-up/Step5AccountReview';
import ConfirmationCode from '../../components/ConfirmationCode';
import {signUpUser} from '../../clients/userService';
const ProviderSignUpScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [providerData, setProviderData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    providerName: '',
    providerImage: null,
    category: '',
    availability: {},
    timeSlotLength: 30,
    services: [],
  });
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);

  const handleInputChange = (field, value) => {
    setProviderData({...providerData, [field]: value});
    setErrors({...errors, [field]: ''});
  };

  const validateStep = step => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!providerData.email) {
          newErrors.email = 'Email is required';
        }
        if (!providerData.password) {
          newErrors.password = 'Password is required';
        }
        if (providerData.password !== providerData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 2:
        if (!providerData.providerName) {
          newErrors.providerName = 'Provider Name is required';
        }
        if (!providerData.providerImage) {
          newErrors.providerImage = 'Provider Image is required';
        }
        if (!providerData.category) {
          newErrors.category = 'Category is required';
        }
        break;
      case 3:
        if (Object.keys(providerData.availability).length === 0) {
          newErrors.availability = 'At least one day of availability is required';
        }
        break;
      case 4:
        if (providerData.services.length === 0) {
          newErrors.services = 'At least one service is required';
        }
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        scrollToTop();
      } else {
        handleSignUp();
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
  };

  const handleSignUp = async () => {
    try {
      const response = await signUpUser(providerData.email, providerData.password, providerData.email, 'SERVICE_PROVIDER', providerData, '');

      if (response.success) {
        setCurrentStep(6);
      } else {
        Alert.alert('Sign-Up Failed', response.message);
      }
    } catch (error) {
      console.error('Sign-Up error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please check the console for more details.');
    }
  };

  const handleConfirmationSuccess = () => {
    navigation.navigate('Login');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1AccountInfo providerData={providerData} handleInputChange={handleInputChange} errors={errors} />;
      case 2:
        return <Step2AccountInfo providerData={providerData} handleInputChange={handleInputChange} errors={errors} />;
      case 3:
        return <Step3AccountInfo providerData={providerData} handleInputChange={handleInputChange} errors={errors} />;
      case 4:
        return <Step4ServiceDetails providerData={providerData} handleInputChange={handleInputChange} errors={errors} />;
      case 5:
        return <Step5AccountReview providerData={providerData} />;
      case 6:
        return (
          <ConfirmationCode
            email={providerData.email}
            onConfirmationSuccess={handleConfirmationSuccess}
            onNavigateToLogin={navigateToLogin}
            userType={'SERVICE_PROVIDER'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SubtitleContainer subtitle="Sign Up">
        <WhiteContainer>
          <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
            {renderStep()}
            {currentStep < 6 && (
              <View style={styles.buttonContainer}>
                {currentStep > 1 && <Button title="Previous" onPress={handlePreviousStep} style={styles.button} />}
                <Button title={currentStep === 5 ? 'Sign Up' : 'Next'} onPress={handleNextStep} style={styles.button} />
              </View>
            )}
          </ScrollView>
        </WhiteContainer>
      </SubtitleContainer>
      <TouchableOpacity onPress={navigateToLogin} style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Text style={styles.loginLink}>Log in →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.text,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  confirmationTitle: {
    ...fontStyles.title,
    color: colours.text,
    marginBottom: 20,
  },
  confirmationSubtitle: {
    ...fontStyles.body,
    color: colours.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: colours.text,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    color: colours.text,
  },
  confirmButton: {
    backgroundColor: colours.black,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  confirmButtonText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.buttonText,
  },
  resendText: {
    ...fontStyles.body,
    fontWeight: 'bold',
    color: colours.text,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colours.backgroundDark,
  },
  loginText: {
    ...fontStyles.body,
    color: colours.text,
    fontWeight: 'bold',
  },
  loginLink: {
    ...fontStyles.body,
    fontFamily: fonts.medium,
    fontWeight: 'bold',
    color: colours.text,
    marginLeft: 5,
  },
});

export default ProviderSignUpScreen;
