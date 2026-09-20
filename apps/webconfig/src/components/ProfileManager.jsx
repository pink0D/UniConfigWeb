import React, { useState } from 'react';

const MAX_PROFILE_NAME_LENGTH = 32;

const ProfileManager = ({ profiles = [], onSelect, onDelete, onAdd, onRename }) => {
  const [draftName, setDraftName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = () => {
    setDraftName('');
    setIsAdding(true);
  };

  const handleConfirmAdd = () => {
    const name = draftName.trim();
    if (!name) return;
    if (onAdd) onAdd(name);
    setIsAdding(false);
    setDraftName('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setDraftName('');
  };

  const handleEditFocus = (index) => {
    setEditingIndex(index);
    setEditName(String((profiles[index] && profiles[index].name) || ''));
  };

  const handleConfirmRename = (index) => {
    const name = editName.trim();
    if (!name) return;
    if (onRename) onRename(index, name);
    setEditingIndex(null);
    setEditName('');
  };

  const handleDiscardRename = () => {
    setEditingIndex(null);
    setEditName('');
  };

  // Sort profiles for display: the exact name "Default" is always first,
  // then the rest are sorted alphabetically ignoring letter case.
  // Keep each entry's original index so select/delete/edit still target the
  // correct item in the underlying (unsorted) profiles array.
  const sortedProfiles = profiles
    .map((profile, index) => ({ profile, index }))
    .sort((a, b) => {
      const nameA = String(a.profile.name || '').trim();
      const nameB = String(b.profile.name || '').trim();
      const isDefaultA = nameA === 'Default';
      const isDefaultB = nameB === 'Default';

      if (isDefaultA !== isDefaultB) return isDefaultA ? -1 : 1;
      return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
    });

  return (
    <>
      <h3 className="section-title">Profiles</h3>
      <div className="wifi-network-list">
        {sortedProfiles.map(({ profile, index }) => {
          const originalName = String(profile.name || '');
          const isEditingThis = editingIndex === index;
          const isRenaming = isEditingThis && editName.trim() !== originalName.trim();

          return (
            <div key={index} className="network-row">
              {isRenaming ? (
                <button
                  className="profile-select-label"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleConfirmRename(index)}
                  title="Rename this profile"
                >
                  Rename
                </button>
              ) : profile.active ? (
                <span className="profile-active-label">Active</span>
              ) : (
                <button
                  className="profile-select-label"
                  onClick={() => onSelect(index)}
                  title="Set this profile as active"
                >
                  Select
                </button>
              )}
              <input
                className="network-input"
                type="text"
                placeholder="Profile name"
                value={isEditingThis ? editName : originalName}
                maxLength={MAX_PROFILE_NAME_LENGTH}
                onFocus={() => handleEditFocus(index)}
                onChange={(e) => {
                  if (editingIndex === index) {
                    setEditName(String(e.target.value).slice(0, MAX_PROFILE_NAME_LENGTH));
                  }
                }}
                onBlur={() => handleDiscardRename()}
              />
              {isRenaming ? (
                <button
                  className="btn-delete"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleDiscardRename}
                  title="Cancel rename"
                >
                  &#10005;
                </button>
              ) : (
                <button
                  className="btn-delete"
                  onClick={() => onDelete(index)}
                  title="Remove profile"
                >
                  &#10005;
                </button>
              )}
            </div>
          );
        })}
        {isAdding && (
          <div className="network-row">
            <button
              className="profile-select-label"
              onClick={handleConfirmAdd}
              title="Save this profile"
            >
              Add
            </button>
            <input
              className="network-input"
              type="text"
              placeholder="Profile name"
              value={draftName}
              maxLength={MAX_PROFILE_NAME_LENGTH}
              onChange={(e) => setDraftName(String(e.target.value).slice(0, MAX_PROFILE_NAME_LENGTH))}
              autoFocus
            />
            <button
              className="btn-delete"
              onClick={handleCancelAdd}
              title="Cancel adding profile"
            >
              &#10005;
            </button>
          </div>
        )}
        {!isAdding && (
          <div className="network-row network-add-row" onClick={handleAdd}>
            <span className="add-icon-text">+</span>
            <div className="network-placeholder">Add profile</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileManager;

