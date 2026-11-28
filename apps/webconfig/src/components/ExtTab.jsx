import React, { useState } from 'react';
import SettingsPage from './SettingsPage.jsx';
import ProfileManager from './ProfileManager.jsx';
import BluetoothSettings from './BluetoothSettings.jsx';
import TelegramBot from './TelegramBot.jsx';
import DeepSleep from './DeepSleep.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import ApiService from './ApiService';
import SavingOverlay from './SavingOverlay.jsx';

const ExtForm = ({ data, onDataChange, onRefreshData, configEndpoint, enableRedirect }) => {
  const [selectIndex, setSelectIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState(null);

  const hasProfileManager = data.ProfileManager && typeof data.ProfileManager === 'object';
  const hasBluetoothSettings = data.BluetoothSettings && typeof data.BluetoothSettings === 'object';
  const hasDeepSleepSettings = data.DeepSleepSettings && typeof data.DeepSleepSettings === 'object';
  const hasTelegramBot = data.TelegramBot && typeof data.TelegramBot === 'object';

  const handleBluetoothChange = (value) => {
    onDataChange({
      ...data,
      BluetoothSettings: { enablePairingAfterStartup: value },
    });
  };

  const handleDeepSleepChange = (value) => {
    onDataChange({
      ...data,
      DeepSleepSettings: { enableDeepSleep: value },
    });
  };

  const handleTelegramChange = (settings) => {
    onDataChange({ ...data, TelegramBot: settings });
  };

  const handleSelectProfile = (index) => {
    setSelectIndex(index);
  };

  const handleDeleteProfile = (index) => {
    setDeleteIndex(index);
  };

  const handleConfirmSelect = async () => {
    const index = selectIndex;
    setSelectIndex(null);
    if (index === null) return;

    const profiles = (data.ProfileManager && data.ProfileManager.profiles) || [];
    const nextProfiles = profiles.map((profile, i) => ({
      ...profile,
      active: i === index,
    }));
    const nextData = {
      ...data,
      ProfileManager: { ...(data.ProfileManager || {}), profiles: nextProfiles },
    };

    setSaveStatus('saving');
    setSaveError(null);
    try {
      const savedData = await ApiService.saveConfig(configEndpoint, {
        ...nextData,
        reboot: true,
      });
      if (enableRedirect) {
        window.location.href = '/';
      } else {
        onRefreshData(savedData);
        setSaveStatus('done');
      }
    } catch (err) {
      setSaveError(err.message);
      setSaveStatus('error');
    }
  };

  const handleConfirmDelete = async () => {
    const index = deleteIndex;
    setDeleteIndex(null);
    if (index === null) return;

    const profiles = (data.ProfileManager && data.ProfileManager.profiles) || [];
    const nextProfiles = profiles.map((profile, i) =>
      i === index ? { ...profile, delete: true } : profile
    );
    const nextData = {
      ...data,
      ProfileManager: { ...(data.ProfileManager || {}), profiles: nextProfiles },
    };

    setSaveStatus('saving');
    setSaveError(null);
    try {
      const savedData = await ApiService.saveConfig(configEndpoint, { ...nextData });
      if (enableRedirect) {
        window.location.href = '/';
      } else {
        onRefreshData(savedData);
        setSaveStatus('done');
      }
    } catch (err) {
      setSaveError(err.message);
      setSaveStatus('error');
    }
  };

  const handleAddProfile = async (name) => {
    const trimmedName = String(name || '').trim();
    if (!trimmedName) return;

    const profiles = (data.ProfileManager && data.ProfileManager.profiles) || [];
    const nextProfiles = [...profiles, { name: trimmedName, active: false }];
    const nextData = {
      ...data,
      ProfileManager: { ...(data.ProfileManager || {}), profiles: nextProfiles },
    };

    setSaveStatus('saving');
    setSaveError(null);
    try {
      const savedData = await ApiService.saveConfig(configEndpoint, { ...nextData });
      if (enableRedirect) {
        window.location.href = '/';
      } else {
        onRefreshData(savedData);
        setSaveStatus('done');
      }
    } catch (err) {
      setSaveError(err.message);
      setSaveStatus('error');
    }
  };

  const handleRenameProfile = async (index, newName) => {
    const trimmedName = String(newName || '').trim();
    if (!trimmedName) return;

    const profiles = (data.ProfileManager && data.ProfileManager.profiles) || [];
    if (index === null || index === undefined || index < 0 || index >= profiles.length) return;

    const nextProfiles = profiles.map((profile, i) =>
      i === index ? { ...profile, rename: true, name_new: trimmedName } : profile
    );
    const nextData = {
      ...data,
      ProfileManager: { ...(data.ProfileManager || {}), profiles: nextProfiles },
    };

    setSaveStatus('saving');
    setSaveError(null);
    try {
      const savedData = await ApiService.saveConfig(configEndpoint, { ...nextData });
      if (enableRedirect) {
        window.location.href = '/';
      } else {
        onRefreshData(savedData);
        setSaveStatus('done');
      }
    } catch (err) {
      setSaveError(err.message);
      setSaveStatus('error');
    }
  };

  const handleDismissSaving = () => {
    setSaveStatus('idle');
    setSaveError(null);
  };

  return (
    <>
      {hasProfileManager && (
        <ProfileManager
          profiles={(data.ProfileManager && data.ProfileManager.profiles) || []}
          onSelect={handleSelectProfile}
          onDelete={handleDeleteProfile}
          onAdd={handleAddProfile}
          onRename={handleRenameProfile}
        />
      )}

      {hasBluetoothSettings && (
        <BluetoothSettings
          value={!!data.BluetoothSettings.enablePairingAfterStartup}
          onChange={handleBluetoothChange}
        />
      )}

      {hasDeepSleepSettings && (
        <DeepSleep
          value={!!data.DeepSleepSettings.enableDeepSleep}
          onChange={handleDeepSleepChange}
        />
      )}

      {hasTelegramBot && (
        <TelegramBot
          settings={data.TelegramBot}
          onChange={handleTelegramChange}
        />
      )}

      {selectIndex !== null && (
        <ConfirmDialog
          message="Activate this profile?"
          onConfirm={handleConfirmSelect}
          onCancel={() => setSelectIndex(null)}
        />
      )}

      {deleteIndex !== null && (
        <ConfirmDialog
          message="Delete this profile?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteIndex(null)}
        />
      )}

      <SavingOverlay
        status={saveStatus}
        errorMessage={saveError}
        onDismiss={handleDismissSaving}
      />
    </>
  );
};

const ExtTab = ({ configEndpoint, enableRedirect = true }) => {
  return (
    <SettingsPage
      configEndpoint={configEndpoint}
      defaultData={{}}
      saveDataTransform={(data) => ({ ...data })}
      enableRedirect={enableRedirect}
    >
      <ExtForm
        configEndpoint={configEndpoint}
        enableRedirect={enableRedirect}
      />
    </SettingsPage>
  );
};

export default ExtTab;
