import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import ConfirmDialog from '../components/ConfirmDialog';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useCompanies } from '../context/CompanyContext';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../context/ThemeContext';
import { FadeInView, SlideUpView } from '../components/AnimatedView';
import { toast } from '../utils/toast';

export default function CreateCompanyScreen({ route, navigation }) {
  const { company: editCompany, edit } = route.params || {};
  const { addCompany, updateCompany, deleteCompany } = useCompanies();
  const { openMenu } = useMenu();
  const { theme } = useTheme();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const [name, setName] = useState(editCompany?.name || '');
  const [gstin, setGstin] = useState(editCompany?.gstin || '');
  const [website, setWebsite] = useState(editCompany?.website || '');
  const [address, setAddress] = useState(editCompany?.address || '');
  const [mobile, setMobile] = useState(editCompany?.mobile || '');
  const [email, setEmail] = useState(editCompany?.email || '');
  const [logo, setLogo] = useState(editCompany?.logo || null);


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.error('Please allow access to your photo library.', 'Permission needed');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Company name is required.', 'Required');
      return;
    }
    const data = {
      name: name.trim(),
      gstin: gstin.trim() || undefined,
      website: website.trim() || undefined,
      address: address.trim() || undefined,
      mobile: mobile.trim() || undefined,
      email: email.trim() || undefined,
      logo: logo || null,
    };
    try {
      if (edit && editCompany?.id) {
        await updateCompany(editCompany.id, data);
        toast.success('Company updated.');
      } else {
        await addCompany(data);
        toast.success('Company created.');
      }
      navigation.goBack();
    } catch (err) {
      toast.error(err.data?.error || err.message || 'Failed to save company.');
    }
  };

  const handleDeleteCompany = async () => {
    setDeleteDialogVisible(false);
    if (edit && editCompany?.id) {
      try {
        await deleteCompany(editCompany.id);
        toast.success('Company deleted.');
        navigation.goBack();
      } catch (err) {
        toast.error(err.data?.error || err.message || 'Failed to delete company.');
      }
    }
  };

  return (
    <LinearGradient
      colors={theme.gradientList}
      style={styles.container}
    >
      <FadeInView delay={0} duration={400} style={styles.header}>
        <TouchableOpacity
          style={[styles.menuBtn, { backgroundColor: theme.surfaceAlt }]}
          onPress={openMenu}
          activeOpacity={0.7}
        >
          <Text style={[styles.menuIcon, { color: theme.text }]}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnWrap}>
          <Text style={[styles.backBtn, { color: theme.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{edit ? 'Edit Company' : 'Create Company'}</Text>
      </FadeInView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SlideUpView delay={100} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Company Logo (optional)</Text>
          <TouchableOpacity style={styles.logoBtn} onPress={pickImage}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logoPreview} />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <Text style={[styles.logoPlaceholderText, { color: theme.textHint }]}>+ Add Logo</Text>
              </View>
            )}
          </TouchableOpacity>
        </SlideUpView>

        <SlideUpView delay={150} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Company Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter company name"
            placeholderTextColor={theme.textMuted}
          />
        </SlideUpView>

        <SlideUpView delay={200} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>GSTIN (optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={gstin}
            onChangeText={setGstin}
            placeholder="e.g. 29AABCU9603R1ZM"
            placeholderTextColor={theme.textMuted}
          />
        </SlideUpView>

        <SlideUpView delay={250} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Website (optional)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={website}
            onChangeText={setWebsite}
            placeholder="www.example.com"
            placeholderTextColor={theme.textMuted}
            autoCapitalize="none"
          />
        </SlideUpView>

        <SlideUpView delay={300} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Full address"
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={3}
          />
        </SlideUpView>

        <SlideUpView delay={350} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Mobile Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={mobile}
            onChangeText={setMobile}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor={theme.textMuted}
            keyboardType="phone-pad"
          />
        </SlideUpView>

        <SlideUpView delay={400} style={styles.section}>
          <Text style={[styles.label, { color: theme.textHint }]}>Email Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            value={email}
            onChangeText={setEmail}
            placeholder="billing@company.com"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </SlideUpView>

        <SlideUpView delay={450}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <LinearGradient
              colors={theme.accentGradient}
              style={styles.saveBtnGradient}
            >
              <Text style={styles.saveBtnText}>
                {edit ? 'Update Company' : 'Create Company'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {edit && editCompany?.id && (
            <TouchableOpacity
              style={[styles.deleteBtn, { borderColor: theme.danger }]}
              onPress={() => setDeleteDialogVisible(true)}
            >
              <Text style={[styles.deleteBtnText, { color: theme.danger }]}>Delete Company</Text>
            </TouchableOpacity>
          )}
        </SlideUpView>
      </ScrollView>
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Company"
        message={`Are you sure you want to delete ${editCompany?.name}? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteCompany}
        onCancel={() => setDeleteDialogVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  backBtnWrap: {
    marginLeft: 12,
  },
  backBtn: {
    fontSize: 16,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  section: { marginBottom: 20 },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  logoBtn: {
    alignSelf: 'flex-start',
  },
  logoPreview: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    fontSize: 14,
  },
  saveBtn: {
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 16,
  },
  saveBtnGradient: {
    padding: 20,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: 16,
    borderRadius: 6,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
