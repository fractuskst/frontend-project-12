import React, { useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { useGetChannelsQuery, useRenameChannelMutation } from '../../store/api/channelsApi.js';
import useModalValidation from '../../helpers/useModalValidation.js';
import { setActive } from '../../store/slices/channelsSlice.js';
import { closeModal } from '../../store/slices/modalsSlice.js';

const RenameChannel = () => {
  const dispatch = useDispatch();
  const [renameChannel] = useRenameChannelMutation();
  const channelId = useSelector((state) => state.modals.data);
  const { data: channels } = useGetChannelsQuery();
  const schema = useModalValidation(channels);
  const inputRef = useRef(null);
  const currentChannel = channels?.find((channel) => channel.id === channelId);
  const currentName = currentChannel ? currentChannel.name : '';
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: currentName,
    },
    validationSchema: schema,
    validateOnChange: false,

    onSubmit: async (values) => {
      const censured = filter.clean(values.name);
      try {
        await renameChannel({ name: censured, id: channelId }).then(({ data }) => {
          dispatch(setActive(data));
          dispatch(closeModal());
          toast.success(t('toasts.channelRename'));
        });
      } catch (e) {
        console.error(e);
        toast.error(t('toasts.errors.channelRenameError'));
      }
    },
  });

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  return (
    <Modal centered show="true" onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              id="name"
              isInvalid={formik.errors.name}
              ref={inputRef}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('tips.channelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex justify-content-end">
            <Button
              className="me-2"
              variant="secondary"
              type="button"
              onClick={() => dispatch(closeModal())}
            >
              {t('modals.cancel')}
            </Button>
            <Button type="submit">{t('modals.submit')}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
